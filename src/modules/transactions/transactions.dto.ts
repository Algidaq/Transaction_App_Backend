import { IGetCustomerDto, IGetAccountDto } from '../customers/customer.dto';
import { CurrencyEntity } from '../currency/currency.entity';
import { DeepPartial } from 'typeorm';
import { TransactionExchangeRateEntity } from './entity/exchange_rate/exchange.rate.entity';
import { CustomerEntity, AccountEntity } from '../customers/customer.entity';
import { TransactionEntity } from './entity/transaction.entity';

export interface ICreateTransactionDto {
  customer: CustomerEntity;
  fromAccount: AccountEntity;
  amount: number;
  balanceSnapshot: number;
  exchangeRate: ICreateExchangeRate;
  comment?: string;
}
export interface IDepositeTransactionDto extends ICreateTransactionDto {}

export interface ICreateExchangeRate {
  fromCurrency: CurrencyEntity;
  toCurrency: CurrencyEntity;
  rate: number;
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
