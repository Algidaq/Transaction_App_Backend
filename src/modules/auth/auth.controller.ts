import { UserDao } from '../user/models/user.dao';
import express from 'express';
import Joi from 'joi';
import networkHandler from '../../utils/network.handler';
import { getAuthDtoFromBody } from './auth.dto';
import { comparePassword, getJwtToken } from '../../utils/utils';
import bcrypt from 'bcrypt';

export class AuthController {
  constructor(private userDao: UserDao = new UserDao()) {}
  validationScheam: Joi.ObjectSchema = Joi.object({
    phone: Joi.string().required().pattern(RegExp('[0-9]')),
    password: Joi.string().required().min(4),
  });
  validateAuthSchema = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { error } = this.validationScheam.validate(req.body);
    if (error) return networkHandler.badRequest(res, error.message);
    next();
  };

  auth = async (req: express.Request, res: express.Response) => {
    try {
      const authDto = getAuthDtoFromBody(req.body);
      const user = await this.userDao.findSingleResource({
        where: { phone: authDto.phone },
        select: ['id', 'fullName', 'phone', 'role', 'updateDate', 'password'],
      });
      if (!user) return this.invalidUserNameOrPassword(res);
      console.log(user, authDto);
      const isCorrect = await bcrypt.compare(authDto.password, user.password);
      if (!isCorrect) return this.invalidUserNameOrPassword(res);
      const token = getJwtToken(user);
      res.setHeader('authorization', token);
      return res.json({ token });
    } catch (e) {
      console.error(e);
      return networkHandler.serverError(res, 'An Error Occured');
    }
  };

  private invalidUserNameOrPassword = (res: express.Response) => {
    return networkHandler.badRequest(res, 'Invalid username or password');
  };
}
