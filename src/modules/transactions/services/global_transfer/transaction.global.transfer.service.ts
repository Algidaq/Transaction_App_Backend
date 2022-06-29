import { ITransactionService } from '../../base.transaction.service';
import { CustomerEntity } from '../../../customers/customer.entity';
import { AccountEntity } from '../../../customers/accounts/customer.account.entity';
import { CurrencyEntity } from '../../../currency/currency.entity';
import { TransactionInfoEntity } from '../../entity/transaction_info/transaction.info.entity';
import { TransactionEntity } from '../../entity/transaction.entity';
import { Logger } from '../../../../utils/logger';
import ApplicationDataSource from '../../../../database/database';
export class TransactionGlobalTransferService extends ITransactionService {
  handleGlobalTransfer = async (
    data: IGlobalTransfer
  ): Promise<TransactionEntity> => {
    const _runner = ApplicationDataSource.createQueryRunner();
    const [queryRunner, transaction, dto] = await super.makeTransaction(
      _runner,
      data.body,
      data.customer,
      data.fromAccount,
      'globalTransfer',
      data.toCurrency
    );
    try {
      const transactionInfo = this.getGlobalTransferEntity(data.body);
      const [fromAccount] = this.getAccountEntityFromDto([
        { customer: data.customer, account: data.fromAccount },
      ]);
      fromAccount.balance = fromAccount.balance - dto.amount;
      await queryRunner.manager.save<AccountEntity>(fromAccount);
      await queryRunner.manager.save<TransactionInfoEntity>(transactionInfo);
      transaction.transactionInfo = transactionInfo;
      await queryRunner.manager.save<TransactionEntity>(transaction);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return transaction;
    } catch (e: any) {
      Logger.error(e);
      throw Error('An Error occured', { cause: e });
    }
  };

  getGlobalTransferEntity = (body: any): TransactionInfoEntity => {
    const entity = new TransactionInfoEntity();
    entity.fullName = body.transactionInfo.fullName ?? 'N/A';
    entity.phone = body.transactionInfo.phone ?? 'N/A';
    entity.bankAccount = body.transactionInfo.bankAccount ?? 'N/A';
    return entity;
  };
}

export interface IGlobalTransfer {
  body: any;
  customer: CustomerEntity;
  fromAccount: AccountEntity;
  toCurrency: CurrencyEntity;
}
