import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectSchema } from 'joi';
import { ParsedQs } from 'qs';
import { ICommonController } from '../../../common/common.controller';
import Joi from 'joi';
import { DeepPartial } from 'typeorm';
import { CurrencyEntity } from '../../currency/currency.entity';
import { CustomerAccountService } from './customer.account.service';
import networkHandler from '../../../utils/network.handler';
import { IGetAccountDto } from '../customer.dto';
import { CustomerEntity } from '../customer.entity';
import { Logger } from '../../../utils/logger';
export class CustomerAccountController extends ICommonController {
  constructor(
    private accountService: CustomerAccountService = new CustomerAccountService()
  ) {
    super();
  }

  get creationSchema(): ObjectSchema<any> {
    return Joi.object({
      balance: Joi.number().greater(-1),
      currency: Joi.object<DeepPartial<CurrencyEntity>>({
        id: Joi.number().greater(-1).required(),
        name: Joi.string().required(),
        symbol: Joi.string().required(),
        createDate: Joi.string(),
        updateDate: Joi.string(),
      }).required(),
    });
  }

  addResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const customer: CustomerEntity = (req as any).entity;
      const _entity = await this.accountService.addResource(req.body, customer);
      Logger.info(_entity);
      const element = await this.accountService.getAccountById(
        _entity.generatedMaps[0].id
      );

      res.json({
        id: element?.id,
        balance: element?.balance,
        currency: element?.currency,
        createDate: element?.createDate,
        updateDate: element?.updateDate,
      });
    } catch (e: any) {
      Logger.error(e);
      return networkHandler.badRequest(res, 'Account Already extis');
    }
  };

  findSingleResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    const accountId: string = req.params.accountId ?? 'N/A';
    const account = await this.accountService.getAccountById(accountId);
    if (!account) {
      return networkHandler.entityNotFound(res, 'Account', accountId);
    }
    return res.json(account);
  };

  findAllResources = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const accounts = await this.accountService.getAccountsByCustomerId(
        req.params
      );
      const formattedAccounts = accounts.map<IGetAccountDto>((element) => {
        return {
          id: element.id,
          balance: element.balance,
          currency: element.currency,
          createDate: element.createDate,
          updateDate: element.updateDate,
        };
      });
      return res.json(formattedAccounts);
    } catch (e) {
      Logger.error(e);
      return networkHandler.serverError(res, 'Error Occured');
    }
  };

  deleteResource(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> {
    throw new Error('Method not implemented.');
  }
}
