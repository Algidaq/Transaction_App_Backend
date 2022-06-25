import { CustomerEntity, AccountEntity } from '../../customers/customer.entity';
import { TransactionEntity } from '../entity/transaction.entity';
import ApplicationDataSource from '../../../database/database';
import { ITransactionService } from '../transaction.service';
import { CurrencyEntity } from '../../currency/currency.entity';

export class TransactionDepositeService extends ITransactionService {
  makeAccountDeposite = async (
    body: any,
    customer: CustomerEntity,
    fromAccount: AccountEntity,
    toCurrency: CurrencyEntity
  ): Promise<TransactionEntity> => {
    const _runner = ApplicationDataSource.createQueryRunner();
    const [queryRunner, transaction, dto] = await super.makeTransaction(
      _runner,
      body,
      customer,
      fromAccount,
      'deposite',
      toCurrency
    );
    try {
      const updateAccountEntity = await this.getAccountEntityFromDto(
        customer,
        fromAccount
      );
      updateAccountEntity.balance = fromAccount.balance + dto.amount;
      await queryRunner.manager.save<AccountEntity>(updateAccountEntity);
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
}
