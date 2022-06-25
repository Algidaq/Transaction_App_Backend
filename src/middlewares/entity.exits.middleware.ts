import { ObjectLiteral } from 'typeorm';
import { ICommonDao } from '../common/common.dao';
import express from 'express';
import networkHandler from '../utils/network.handler';
/**
 * check for id in requrest params and findSingleResource if entity not exits stop executing
 * the request and return @NotFoundException
 * else continues to the next and adds Founded entity to request
 */
export function entityExitsMiddleware<T extends ICommonDao<ObjectLiteral>>(
  dao: T,
  keyName: string = 'id',
  paramKeyName: string = 'id'
) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const entity = await dao.findSingleResource({
      where: { [keyName]: req.params[paramKeyName] ?? 'N/A' },
    });
    if (!entity) {
      return networkHandler.entityNotFound(res, 'Entity', req.params.id);
    }
    (req as any).entity = entity;
    next();
  };
}
