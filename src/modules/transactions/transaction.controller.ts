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
export class TransactionController extends ICommonController {
  constructor(private service: TransactionService = new TransactionService()) {
    super();
  }

  get creationSchema(): ObjectSchema<any> {
    throw new Error('Method not implemented.');
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
