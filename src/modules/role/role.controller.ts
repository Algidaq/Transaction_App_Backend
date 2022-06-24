import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectSchema } from 'joi';
import { ParsedQs } from 'qs';
import { ICommonController } from '../../common/common.controller';
import Joi from 'joi';
import { RoleDao } from './role.dao';
import networkHandler from '../../utils/network.handler';
import { setTotalPagesHeader } from '../../utils/utils';
export class RoleController extends ICommonController {
  constructor(private roleDao: RoleDao = new RoleDao()) {
    super();
  }
  get creationSchema(): ObjectSchema<any> {
    return Joi.object({
      role: Joi.string().required().min(3),
    });
  }
  addResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    const name: string = req.body.role;
    const role = await this.roleDao.addResource(name.toLowerCase());
    res.json(role);
    return;
  };
  findSingleResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    const id: string = req.params.id;
    const role = await this.roleDao.findSingleResource({
      where: { id: Number.parseInt(id ?? '-1') },
    });
    if (!role) return networkHandler.entityNotFound(res, 'Role', id);
    return res.json(role);
  };

  findAllResources = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    const [roles, count] = await this.roleDao.getAllResourcesAndCount();
    setTotalPagesHeader(res, req.query, count);
    return res.json(roles);
  };
}
