import { TransactionDao } from './transaction.dao';
import { TransactionEntity } from './entity/transaction.entity';
import { ITransactionQueryParams } from './transactions.dto';
import { getPagination } from '../../utils/utils';
import {
  FindManyOptions,
  FindOptionsWhere,
  Like,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsOrderValue,
} from 'typeorm';
import moment from 'moment';
import { TransactionType } from './types/transactions.types';
import { OrderType } from '../../common/common.queryparams';
import { Logger } from '../../utils/logger';
export class TransactionService {
  constructor(private dao: TransactionDao = new TransactionDao()) {}

  getTransactionById = async (
    params: any
  ): Promise<TransactionEntity | null> => {
    const id = params.id ?? 'N/A';
    return this.dao.findSingleResource({ where: { id } });
  };

  getAllTransactions = async (
    queryParams: any
  ): Promise<TransactionEntity[]> => {
    const options = this.getTransactionQueryParams(queryParams);
    return this.dao.getAllResources({ ...options, skip: 0, take: undefined });
  };

  getAllTransactionsAndCount = async (
    query: any
  ): Promise<[TransactionEntity[], number]> => {
    const options = this.getTransactionQueryParams(query);
    return this.dao.getAllResourcesAndCount(options);
  };

  deleteTransactionById = async (
    transaction: TransactionEntity
  ): Promise<TransactionEntity> => {
    return this.dao.deleteResource(transaction);
  };

  private getTransactionQueryParams = (
    queryParams: ITransactionQueryParams
  ): FindManyOptions<TransactionEntity> => {
    const { skip, take } = getPagination(queryParams);
    const where: FindOptionsWhere<TransactionEntity>[] = [];

    if (queryParams.customerId)
      where.push({ customer: { id: queryParams.customerId } });

    if (queryParams.accountId)
      where.push({ fromAccount: { id: queryParams.accountId } });

    if (queryParams.date) where.push({ date: Like(`%${queryParams.date}%`) });

    const transactionType = this.getTransactionType(queryParams.type);
    Logger.info({ transactionType });
    if (transactionType) where.push({ type: transactionType });
    const orderby = this.getOrderBy(queryParams.orderBy, queryParams.order);
    Logger.warn({ orderby });
    return {
      where: where.length >= 1 ? where : undefined,
      skip: skip,
      take: take,
      order: orderby,
    };
  };

  private getTransactionType = (type?: string): TransactionType | null => {
    if (type === 'deposite') return 'deposite';
    if (type === 'localTransfer') return 'localeTransfer';
    if (type === 'globalTransfer') return 'globalTransfer';
    if (type === 'withdraw') return 'withdraw';
    return null;
  };

  private getOrderBy = (
    orderBy?: string,
    order: OrderType = 'desc'
  ): FindOptionsOrder<TransactionEntity> | undefined => {
    if (orderBy === 'amount') return { amount: order };
    return { date: order };
  };
}
