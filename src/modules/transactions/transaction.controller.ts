import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectSchema } from 'joi';
import { ParsedQs } from 'qs';
import { ICommonController } from '../../common/common.controller';
import networkHandler from '../../utils/network.handler';
import { TransactionService } from './transaction.service';
import { setTotalPagesHeader } from '../../utils/utils';
import express from 'express';
import { Logger } from '../../utils/logger';
import Joi from 'joi';
import { CustomerService } from '../customers/customers.service';
import { IGetStatementDto } from './transactions.dto';
export class TransactionController extends ICommonController {
  constructor(private service: TransactionService = new TransactionService()) {
    super();
  }

  get creationSchema(): ObjectSchema<any> {
    throw new Error('Method not implemented.');
  }

  get customerStatementSchema(): ObjectSchema<any> {
    return Joi.object({
      customerId: Joi.string().required(),
      fromDate: Joi.date().required(),
      toDate: Joi.date().required(),
    });
  }

  findSingleResource = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    //
    const transaction = await this.service.getTransactionById(req.params);
    if (!transaction)
      return networkHandler.entityNotFound(res, 'Transaction', req.params.id);
    return res.json(transaction);
  };

  findAllResources = async (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void | Response<any, Record<string, any>>> => {
    const page = req.query.page;
    if (page === '-1') {
      const data = await this.service.getAllTransactions(req.query);
      res.json(data);
      return;
    }
    const [transactions, count] = await this.service.getAllTransactionsAndCount(
      req.query
    );
    setTotalPagesHeader(res, req.query, count);
    res.json(transactions);
    return;
  };

  getCustomerStatement = async (
    req: express.Request,
    res: express.Response
  ) => {
    const data: IGetStatementDto = req.body;
    const { error } = this.customerStatementSchema.validate(data);
    if (error) return networkHandler.badRequest(res, error.message);
    try {
      const customer = await new CustomerService().getCustomer({
        id: data.customerId,
      });
      if (!customer) {
        return networkHandler.entityNotFound(res, 'Customer', data.customerId);
      }
      const transactions = await this.service.getCustomerStatement(data);
      return res.json({ customer, transactions });
    } catch (e) {
      Logger.error('getCustomerStatement', [e]);
      return networkHandler.serverError(res, 'Error Occured');
    }
  };

  deleteResource = async (
    req: express.Request,
    res: express.Response
  ): Promise<void | Response<any, Record<string, any>>> => {
    try {
      const transaction = await this.service.getTransactionById(req.params);
      if (!transaction)
        return networkHandler.entityNotFound(res, 'Transaction', req.params.id);
      const deletedTransaction = await this.service.deleteTransactionById(
        transaction
      );
      res.json(deletedTransaction);
    } catch (e) {
      Logger.error(e);
      networkHandler.serverError(res, 'An Error Occured');
      return;
    }
  };

  addResource(
    req: express.Request,
    res: express.Response
  ): Promise<void | Response<any, Record<string, any>>> {
    throw new Error('Method not implemented.');
  }
}
