import { ITransactionController } from '../transaction.controller';
import { TransactionDepositeService } from './transaction.deposite.service';
import { Request } from 'express';
import express from 'express';
import { CustomerEntity } from '../../customers/customer.entity';
import networkHandler from '../../../utils/network.handler';
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
      console.log(
        _entity.id,
        this.transactionService.transactionDao.findSingleResource
      );
      const transaction =
        await this.transactionService.transactionDao.findSingleResource({
          where: { id: _entity.id },
        });
      return res.json(transaction);
    } catch (e) {
      console.log(e);
      return networkHandler.serverError(res, 'Error Occured');
    }
  };
}
