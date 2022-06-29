import { ITransactionController } from '../../base.transaction.controller';
import {
  TransactionGlobalTransferService,
  IGlobalTransfer,
} from './transaction.global.transfer.service';
import Joi from 'joi';
import express from 'express';
import networkHandler from '../../../../utils/network.handler';
import { Logger } from '../../../../utils/logger';
export class TransactionGlobalTransferController extends ITransactionController<TransactionGlobalTransferService> {
  constructor() {
    super(new TransactionGlobalTransferService());
  }
  get globalTransferScheam(): Joi.ObjectSchema<any> {
    return Joi.object({
      transactionInfo: Joi.object({
        fullName: Joi.string().required(),
        phone: Joi.string().pattern(RegExp(/[0-9]/)),
        bankAccount: Joi.string().pattern(RegExp(/[0-9]/)),
      }).required(),
    }).unknown();
  }

  validateGlobalTransferSchema = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { error } = this.globalTransferScheam.validate(req.body);
    if (error) return networkHandler.badRequest(res, error.message);
    next();
  };

  handleGlobalTransfer = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const [customer, account, toCurrency] = this.getTransactionData(req);
      const data: IGlobalTransfer = {
        body: req.body,
        customer,
        fromAccount: account,
        toCurrency,
      };
      const _entity = await this.transactionService.handleGlobalTransfer(data);
      const transaction =
        await this.transactionService.transactionDao.findSingleResource({
          where: { id: _entity.id },
        });
      return res.json(transaction);
    } catch (e) {
      Logger.error(e);
      networkHandler.serverError(res, 'An Error Occured');
      return;
    }
  };
}
