import express from 'express';
import networkHandler from '../utils/network.handler';
import { kPrivateKey } from '../utils/utils';
import * as jwt from 'jsonwebtoken';
import { IGetUserDto } from '../modules/user/models/user.dto';
import { Logger } from '../utils/logger';
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
      Logger.error(e);
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
      const user: IGetUserDto = (req as any).user;
      const index = roles.findIndex((role) => (role = user.role.role));
      if (index === -1) return networkHandler.forbidden(res);
      next();
    };
  };
}
