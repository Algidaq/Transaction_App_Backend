import express from 'express';
import Joi from 'joi';
import networkHandler from '../utils/network.handler';
export abstract class ICommonController {
  constructor() {}
  abstract get creationSchema(): Joi.ObjectSchema;
  validateCreationSchema = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): express.Response | void => {
    const { error } = this.creationSchema.validate(req.body);
    if (!error) return next();
    return networkHandler.badRequest(res, error?.message ?? 'N/A');
  };

  abstract addResource(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response | void>;
  abstract findSingleResource(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response | void>;

  abstract findAllResources(
    req: express.Request,
    res: express.Response
  ): Promise<express.Response | void>;
}
