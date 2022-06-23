import { RoleEntity } from '../modules/role/role.entity';
import express from 'express';
import networkHandler from '../utils/network.handler';
import { kPrivateKey } from '../utils/utils';
import * as jwt from 'jsonwebtoken';
import { IGetUserDto } from '../modules/user/models/user.dto';
export class AuthorizationMiddleware {
  isAuthorizedUser = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const authorizationHeader = req.headers.authorization?.split(' ')[1];
      if (!authorizationHeader) return networkHandler.unauthorized(res);
      const user = jwt.verify(authorizationHeader, kPrivateKey);
      (req as any).user = user;
      next();
    } catch (e) {
      console.error(e);
      return networkHandler.unauthorized(res);
    }
  };
  isAuthByRole = (roles: string[] | undefined) => {
    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      if (!roles) return networkHandler.badRequest(res, 'No Roles where found');
      let user: IGetUserDto = (req as any).user;
      let index = roles.findIndex((role) => (role = user.role.role));
      if (index == -1) return networkHandler.forbidden(res);
      next();
    };
  };
}
