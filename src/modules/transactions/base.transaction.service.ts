import { QueryRunner } from 'typeorm';
import { CustomerEntity } from '../customers/customer.entity';
import { TransactionExchangeRateEntity } from './entity/exchange_rate/exchange.rate.entity';
import { ICreateTransactionDto, ICreateExchangeRate } from './transactions.dto';
import { TransactionEntity } from './entity/transaction.entity';
import { TransactionType } from './types/transactions.types';
import { CurrencyEntity } from '../currency/currency.entity';
import { TransactionDao } from './transaction.dao';
import { AccountEntity } from '../customers/accounts/customer.account.entity';
import { Logger } from '../../utils/logger';

export abstract class ITransactionService {
  constructor(public transactionDao: TransactionDao = new TransactionDao()) {}
  async makeTransaction(
    queryRunner: QueryRunner,
    body: any,
    customer: CustomerEntity,
    fromAccount: AccountEntity,
    type: TransactionType,
    toCurrency: CurrencyEntity
  ): Promise<[QueryRunner, TransactionEntity, ICreateTransactionDto]> {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      /// get Dto from Body
      const dto = this.getTransactionDto(
        body,
        customer,
        fromAccount,
        toCurrency
      );
      // get ExhangeRate Entity to be saved
      const exchangeRate = this.getExchangeRateEntityFromDto(
        dto.exchangeRate,
        dto.amount
      );
      // save ExchangRateEntity
      await queryRunner.manager.save<TransactionExchangeRateEntity>(
        exchangeRate
      );
      // get TransactionEntity from dto
      const transactionEntity = this.getTransactionEntityFromDto(dto);
      /// assign to exhcangeRate to it
      transactionEntity.exchangeRate = exchangeRate;
      transactionEntity.type = type;
      // save Transaction entity
      await queryRunner.manager.save<TransactionEntity>(transactionEntity);
      return [queryRunner, transactionEntity, dto];
    } catch (e) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      Logger.error(e);
      throw Error('Unable to create customer');
    }
  }

  getTransactionDto(
    body: any,
    customer: CustomerEntity,
    fromAccount: AccountEntity,
    toCurrency: CurrencyEntity
  ): ICreateTransactionDto {
    return {
      amount: Math.abs(body.amount),
      customer,
      fromAccount,
      balanceSnapshot: fromAccount.balance,
      exchangeRate: {
        fromCurrency: fromAccount.currency,
        toCurrency,
        rate:
          toCurrency.id === fromAccount.currency.id
            ? 1
            : Number.parseFloat(body.exchangeRate.rate),
      },
      comment: body.comment ?? 'N/A',
    };
  }
  getExchangeRateEntityFromDto(
    dto: ICreateExchangeRate,
    amount: number
  ): TransactionExchangeRateEntity {
    const entity = new TransactionExchangeRateEntity();
    entity.fromCurrency = dto.fromCurrency;
    entity.toCurrency = dto.toCurrency;
    entity.rate = dto.rate;
    entity.exchangedAmount = amount * dto.rate;
    return entity;
  }

  getTransactionEntityFromDto(dto: ICreateTransactionDto): TransactionEntity {
    const transactionEntity = new TransactionEntity();
    transactionEntity.amount = dto.amount;
    transactionEntity.balanceSnapShot = dto.fromAccount.balance;
    transactionEntity.customer = dto.customer;
    transactionEntity.fromAccount = dto.fromAccount;
    transactionEntity.fromAccount.customerId = dto.customer.id;

    transactionEntity.comment = dto.comment ?? 'N/A';
    return transactionEntity;
  }

  getAccountEntityFromDto(
    entities: { customer: CustomerEntity; account: AccountEntity }[]
  ): AccountEntity[] {
    return entities.map((element) => {
      const updatedFromAccount = new AccountEntity();
      updatedFromAccount.id = element.account.id;
      updatedFromAccount.customerId = element.customer.id;
      // updatedFromAccount.currencyId = fromAccount.currency.id;
      updatedFromAccount.currency = element.account.currency;
      updatedFromAccount.balance = element.account.balance;
      return updatedFromAccount;
    });
  }
}
