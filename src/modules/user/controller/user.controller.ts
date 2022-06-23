import { UserService } from '../services/users.service';
import { ICommonController } from '../../../common/common.controller';
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ObjectSchema } from 'joi';
import Joi from 'joi';
import { ICreateUserDto, IGetUserDto } from '../models/user.dto';
import { IGetRoleDto } from '../../role/role.dto';
import networkHandler from '../../../utils/network.handler';
import { UserEntity } from '../entity/user.entity';

export class UserController extends ICommonController {
  constructor(private service: UserService = new UserService()) {
    super();
  }

  get creationSchema(): ObjectSchema<any> {
    return Joi.object<ICreateUserDto>({
      fullName: Joi.string().required().min(3).max(200),
      phone: Joi.string().required().pattern(new RegExp('[0-9]')).max(55),
      password: Joi.string().required().min(4),
      role: Joi.object<IGetRoleDto>({
        id: Joi.number().required().positive(),
        role: Joi.string().required(),
      }).required(),
    });
  }
  addResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const resource = await this.service.addResource(req.body);
      const entity = await this.service.findSingleResource({ id: resource.id });
      return res.json(entity);
    } catch (e) {
      console.error(e);
      return networkHandler.badRequest(res, 'User Already exists');
    }
  };

  findSingleResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const entity: UserEntity | null = await this.service.findSingleResource(
        req.params
      );
      if (entity === null)
        return networkHandler.entityNotFound(res, 'User', req.params.id);
      return res.json(entity);
    } catch (e) {
      console.error(e);
    }
  };
}
