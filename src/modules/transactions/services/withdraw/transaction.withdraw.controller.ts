import { ITransactionController } from '../../transaction.controller';
import { TransactionWithdrawService } from './transaction.withdraw.service';
import express from 'express';
import networkHandler from '../../../../utils/network.handler';
export class TransactionWithdrawController extends ITransactionController<TransactionWithdrawService> {
  constructor() {
    super(new TransactionWithdrawService());
  }

  makeTransactionDeposite = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response | void> => {
    const [customer, fromAccount, toCurrency] = this.getTransactionData(req);
    try {
      const _entity = await this.transactionService.makeAccountWithdraw(
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
