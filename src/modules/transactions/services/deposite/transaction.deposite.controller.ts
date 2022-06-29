import { ITransactionController } from '../../base.transaction.controller';
import express from 'express';
import { CustomerEntity } from '../../../customers/customer.entity';
import networkHandler from '../../../../utils/network.handler';
import { TransactionDepositeService } from './transaction.deposite.service';
import { Logger } from '../../../../utils/logger';

export class TransactionDepositeController extends ITransactionController<TransactionDepositeService> {
  constructor() {
    super(new TransactionDepositeService());
  }

  makeTransactionDeposite = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response | void> => {
    const [customer, fromAccount, toCurrency] = this.getTransactionData(req);
    try {
      const _entity = await this.transactionService.makeAccountDeposite(
        req.body,
        customer,
        fromAccount,
        toCurrency
      );

      const transaction =
        await this.transactionService.transactionDao.findSingleResource({
          where: { id: _entity.id },
        });
      return res.json(transaction);
    } catch (e) {
      Logger.error(e);
      return networkHandler.serverError(res, 'Error Occured');
    }
  };
}
