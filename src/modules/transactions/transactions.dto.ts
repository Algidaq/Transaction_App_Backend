import { IGetCustomerDto, IGetAccountDto } from '../customers/customer.dto';
import { CurrencyEntity } from '../currency/currency.entity';
import { DeepPartial } from 'typeorm';
import { TransactionExchangeRateEntity } from './entity/exchange_rate/exchange.rate.entity';
import { CustomerEntity } from '../customers/customer.entity';
import { TransactionEntity } from './entity/transaction.entity';
import { AccountEntity } from '../customers/accounts/customer.account.entity';
import { ICommonQueryParams } from '../../common/common.queryparams';
import { TransactionType } from './types/transactions.types';

export interface ICreateTransactionDto {
  customer: CustomerEntity;
  fromAccount: AccountEntity;
  amount: number;
  balanceSnapshot: number;
  exchangeRate: ICreateExchangeRate;
  comment?: string;
}
// tslint:disable-next-line:no-empty-interface
export interface IDepositeTransactionDto extends ICreateTransactionDto {}

export interface ICreateExchangeRate {
  fromCurrency: CurrencyEntity;
  toCurrency: CurrencyEntity;
  rate: number;
}

export interface ITransactionQueryParams extends ICommonQueryParams {
  /**
   * filter transactions by customerId
   */
  customerId?: string;
  /**
   * filter transactions by specific customer account
   */
  accountId?: string;
  /**
   * filter transaction by specific date
   */
  date?: string;

  /**
   * filter by transaction type [``deposite``,``withdraw``,``localTransfer``,``globalTransfer``]
   */
  type?: string;
}

export function getExchangeRateEntityFromDto(
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

export function getTransactionEntityFromDto(
  dto: IDepositeTransactionDto
): TransactionEntity {
  const transactionEntity = new TransactionEntity();
  transactionEntity.amount = dto.amount;
  transactionEntity.balanceSnapShot = dto.fromAccount.balance;
  transactionEntity.customer = dto.customer;
  transactionEntity.fromAccount = dto.fromAccount;
  transactionEntity.fromAccount.customerId = dto.customer.id;

  transactionEntity.comment = dto.comment ?? 'N/A';
  return transactionEntity;
}
