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

  addResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const customer = await this.customerService.addResource(req.body);
      console.info(customer);
      const customers = this.customerService.getFormattedCustomerEntity([
        customer,
      ]);

      return res.json(customers[0]);
    } catch (e) {
      console.error(e);
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
    return res.json(customer);
  };

  findAllResources = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const page: number = Number.parseInt(`${req.query.page ?? '1'}`);
      if (page === -1) {
        const customers = this.customerService.getFormattedCustomerEntity(
          await this.customerService.getAllCustomers(req.query)
        );
        return res.json(customers);
      }
      const [customers, count] =
        await this.customerService.getAllCustomersAndCount(req.query);
      setTotalPagesHeader(res, req.query, count);
      return res.json(
        this.customerService.getFormattedCustomerEntity(customers)
      );
    } catch (e) {
      console.error(e);
      return networkHandler.serverError(res, 'Error occured');
    }
  };

  deleteResource(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> {
    throw new Error('Method not implemented.');
  }
}
