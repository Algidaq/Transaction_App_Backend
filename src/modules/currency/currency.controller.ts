import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectSchema } from 'joi';
import { ParsedQs } from 'qs';
import { ICommonController } from '../../common/common.controller';
import { CurrencyService } from './currency.service';
import Joi from 'joi';
import networkHandler from '../../utils/network.handler';
import { setTotalPagesHeader } from '../../utils/utils';
import { Logger } from '../../utils/logger';
export class CurrencyController extends ICommonController {
  constructor(private service: CurrencyService = new CurrencyService()) {
    super();
  }
  get creationSchema(): ObjectSchema<any> {
    return Joi.object({
      name: Joi.string().required().min(2),
      symbol: Joi.string().required().min(2),
    });
  }
  addResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const currency = await this.service.addNewCurrency(req.body);
      return res.json(currency);
    } catch (e) {
      Logger.error(e);
      return networkHandler.badRequest(res, 'Currency Already Exists');
    }
  };
  findSingleResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const currency = await this.service.findOnById(req.params);
      if (currency === null)
        return networkHandler.entityNotFound(res, 'Currency', req.params.id);
      return res.json(currency);
    } catch (e) {
      Logger.error(e);

      return networkHandler.serverError(res, 'An Error Occured');
    }
  };
  findAllResources = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    const [currencies, count] = await this.service.getAllCurrenciesAndCount(
      req.query
    );
    setTotalPagesHeader(res, req.query, count);
    return res.json(currencies);
  };
  deleteResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    const deletedResource = await this.service.deleteCurrency(req.params);
    if (deletedResource === null) {
      return networkHandler.entityNotFound(res, 'Currency', req.params.id);
    }
    return res.json(deletedResource);
  };
}
