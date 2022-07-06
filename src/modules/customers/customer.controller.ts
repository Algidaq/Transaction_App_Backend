import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { custom, ObjectSchema } from 'joi';
import { ParsedQs } from 'qs';
import { ICommonController } from '../../common/common.controller';
import { CustomerService } from './customers.service';
import Joi from 'joi';
import { ICreateCustomerAccountDto, ICreateCustomerDto } from './customer.dto';
import { DeepPartial } from 'typeorm';
import { CurrencyEntity } from '../currency/currency.entity';
import networkHandler from '../../utils/network.handler';
import { setTotalPagesHeader } from '../../utils/utils';
import { CustomerAccountService } from './accounts/customer.account.service';
import { Logger } from '../../utils/logger';
import express from 'express';
import { CustomerEntity } from './customer.entity';
export class CustomerController extends ICommonController {
  constructor(
    private customerService: CustomerService = new CustomerService(),
    private accountService: CustomerAccountService = new CustomerAccountService()
  ) {
    super();
  }
  get creationSchema(): ObjectSchema<any> {
    return Joi.object<ICreateCustomerDto>({
      fullName: Joi.string().required().min(3),
      phone: Joi.string().required().pattern(/[0-9]/).min(3),
      accounts: Joi.array().items({
        balance: Joi.number().greater(-1),
        currency: Joi.object<DeepPartial<CurrencyEntity>>({
          id: Joi.number().positive().required(),
          name: Joi.string().required(),
          symbol: Joi.string().required(),
          createDate: Joi.string(),
          updateDate: Joi.string(),
        }).required(),
      }),
    });
  }
  get updateSchema(): ObjectSchema<any> {
    return Joi.object<ICreateCustomerDto>({
      fullName: Joi.string().min(3),
      phone: Joi.string().pattern(/[0-9]/).min(3),
    }).unknown();
  }

  validateUpdateSchema = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): express.Response | void => {
    const { error } = this.updateSchema.validate(req.body);
    if (!error) return next();
    return networkHandler.badRequest(res, error?.message ?? 'N/A');
  };

  addResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const customer = await this.customerService.addResource(req.body);
      Logger.info(customer);
      const customers = this.customerService.getFormattedCustomerEntity([
        customer,
      ]);

      return res.json(customers[0]);
    } catch (e) {
      Logger.error(e);
      return networkHandler.badRequest(res, 'Customer Already Exists');
    }
  };
  findSingleResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    const customer = await this.customerService.getCustomer(req.params);
    if (!customer) {
      return networkHandler.entityNotFound(res, 'Customer', req.params.id);
    }
    customer.accounts = await this.accountService.getAccountsByCustomerId(
      req.params
    );
    return res.json(customer);
  };

  findAllResources = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const page: number = Number.parseInt(`${req.query.page ?? '1'}`);
      if (page === -1) {
        const _ = this.customerService.getFormattedCustomerEntity(
          await this.customerService.getAllCustomers(req.query)
        );
        return res.json(_);
      }
      const [customers, count] =
        await this.customerService.getAllCustomersAndCount(req.query);
      setTotalPagesHeader(res, req.query, count);
      Logger.warn(customers);
      return res.json(
        this.customerService.getFormattedCustomerEntity(customers)
      );
    } catch (e) {
      Logger.error(e);
      // tslint:disable-next-line:no-console
      console.error(e);
      return networkHandler.serverError(res, 'Error occured');
    }
  };

  deleteResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const customer = await this.customerService.getCustomer(req.params);
      if (!customer) {
        return networkHandler.entityNotFound(res, 'Customer', req.params.id);
      }
      const removedCustomer = await this.customerService.deleteCustomer(
        customer
      );
      return res.json(customer);
    } catch (e) {
      Logger.error(e);
      networkHandler.serverError(res, 'An Occured');
      return;
    }
  };

  updateResources = async (req: express.Request, res: express.Response) => {
    try {
      const customerEntity: CustomerEntity = (req as any).entity;
      const updatedCustomer = await this.customerService.updateCustomer(
        customerEntity,
        req.body
      );
      res.json(updatedCustomer);
      return;
    } catch (e) {
      Logger.error(e);
      networkHandler.serverError(res, 'An Error Occured');
      return;
    }
  };
}
