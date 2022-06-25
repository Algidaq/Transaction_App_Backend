import Joi from 'joi';
import { ITransactionService } from './transaction.service';
import express from 'express';
import networkHandler from '../../utils/network.handler';
import { CustomerDao, AccountDao } from '../customers/customer.dao';
import { CustomerService } from '../customers/customers.service';
import { CustomerAccountService } from '../customers/accounts/customer.account.service';
import { ICreateTransactionDto, ICreateExchangeRate } from './transactions.dto';
import { DeepPartial } from 'typeorm';
import { CustomerEntity } from '../customers/customer.entity';
import { IGetAccountDto } from '../customers/customer.dto';
import { CurrencyEntity } from '../currency/currency.entity';
import { CurrencyService } from '../currency/currency.service';
export abstract class ITransactionController<T extends ITransactionService> {
  constructor(
    public transactionService: T,
    private customerService: CustomerService = new CustomerService(),
    private accountService: CustomerAccountService = new CustomerAccountService(),
    private currencyService: CurrencyService = new CurrencyService()
  ) {}

  validateCreationSchema = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): express.Response | void => {
    const { error } = this.creationSchema.validate(req.body);
    if (!error) return next();
    return networkHandler.badRequest(res, error?.message ?? 'N/A');
  };

  validateIsCustomerAndFromAccountExists = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const customerId: string = req.body['customer']['id'] ?? 'N/A';
    const customer = await this.customerService.getCustomer({ id: customerId });

    if (!customer) {
      networkHandler.entityNotFound(res, 'Customer', customerId);
      return;
    }
    const fromAccountId: string = req.body['fromAccount']['id'] ?? 'N/A';

    const account = await this.accountService.getAccountById(fromAccountId);
    if (!account) {
      networkHandler.entityNotFound(res, 'Customer', customerId);
      return;
    }
    const currencyId: string =
      req.body['exchangeRate']['toCurrency']['id'] ?? 'N/A';
    const toCurrency = await this.currencyService.findOnById({
      id: currencyId,
    });

    if (toCurrency) {
      networkHandler.entityNotFound(res, 'Customer', customerId);
      return;
    }
    (req as any).customer = customer;
    (req as any).fromAccount = account;
    (req as any).toCurrency = toCurrency;

    next();
  };

  get creationSchema(): Joi.ObjectSchema {
    return Joi.object<ICreateTransactionDto>({
      amount: Joi.number().required().positive(),
      comment: Joi.string(),
      fromAccount: Joi.object<IGetAccountDto>({
        id: Joi.string().required(),
        currency: Joi.object(),
        balance: Joi.number(),
        createDate: Joi.string(),
        updateDate: Joi.string(),
      }).required(),
      customer: Joi.object<DeepPartial<CustomerEntity>>({
        id: Joi.string().uuid().required(),
        fullName: Joi.string(),
        accounts: Joi.array(),
        phone: Joi.string(),
        createDate: Joi.string(),
        updateDate: Joi.string(),
      }).required(),
      exchangeRate: Joi.object<ICreateExchangeRate>({
        rate: Joi.number().required().positive(),
        toCurrency: Joi.object<CurrencyEntity>({
          id: Joi.number().required(),
          name: Joi.string(),
          symbol: Joi.string(),
          createDate: Joi.string(),
          updateDate: Joi.string(),
        }).required(),
      }),
    });
  }
}
