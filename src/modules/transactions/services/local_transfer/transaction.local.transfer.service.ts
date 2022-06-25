import {
  CustomerEntity,
  AccountEntity,
} from '../../../customers/customer.entity';
import { TransactionEntity } from '../../entity/transaction.entity';
import ApplicationDataSource from '../../../../database/database';
import { ITransactionService } from '../../transaction.service';
import { LocalTransactionInfoEntity } from '../../entity/local_transaction_info/local.transaction.info.entity';

export class TransactionLocalTransferService extends ITransactionService {
  constructor() {
    super();
  }
  handleAccountToAccountTransfer = async (
    data: ILocaleTransfer
  ): Promise<TransactionEntity> => {
    const _runner = ApplicationDataSource.createQueryRunner();
    const [queryRunner, transaction, dto] = await super.makeTransaction(
      _runner,
      data.body,
      data.customer,
      data.fromAccount,
      'localeTransfer',
      data.toAccount.currency
    );
    try {
      const localeInfo = this.getLocalTransactionInfoEntity(
        data.toCustomer,
        data.toAccount
      );

      transaction.localTransactionInfo =
        await queryRunner.manager.save<LocalTransactionInfoEntity>(localeInfo);
      await queryRunner.manager.save<TransactionEntity>(transaction);

      const updatedToAccount = this.getAccountEntityFromDto(
        data.toCustomer,
        data.toAccount
      );
      const updatedFromAccount = this.getAccountEntityFromDto(
        data.customer,
        data.fromAccount
      );
      updatedFromAccount.balance = updatedFromAccount.balance - dto.amount;
      updatedToAccount.balance =
        updatedToAccount.balance + transaction.exchangeRate.exchangedAmount;

      await queryRunner.manager.save<AccountEntity>(updatedToAccount);
      await queryRunner.manager.save<AccountEntity>(updatedFromAccount);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return transaction;
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw Error('Unable to create customer');
    }
  };

  getLocalTransactionInfoEntity = (
    toCustomer: CustomerEntity,
    toAccount: AccountEntity
  ): LocalTransactionInfoEntity => {
    const entity = new LocalTransactionInfoEntity();
    entity.toAccount = toAccount;
    entity.balanceSnapshot = toAccount.balance;
    entity.toAccount.customerId = toCustomer.id;
    entity.toCustomer = toCustomer;
    return entity;
  };
}

export interface ILocaleTransfer {
  body: any;
  customer: CustomerEntity;
  fromAccount: AccountEntity;
  toAccount: AccountEntity;
  toCustomer: CustomerEntity;
}
