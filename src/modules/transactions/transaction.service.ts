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

    const date = queryParams.date;
    const transactionType = this.getTransactionType(queryParams.type);
    if (transactionType !== undefined && date !== undefined) {
      where.push({
        type: transactionType,
        date: Like(`%${queryParams.date}%`),
      });
    } else if (queryParams.date) {
      where.push({ date: Like(`%${queryParams.date}%`) });
    } else if (transactionType !== undefined) {
      where.push({
        type: transactionType,
      });
    }

    const orderby = this.getOrderBy(queryParams.orderBy, queryParams.order);
    Logger.warn({ orderby });
    // const data = !(
    //   transactionType === undefined || queryParams.date === undefined
    // )

    //   : [{ date: Like(`%${queryParams.date}%`), type: transactionType }];

    return {
      where: where.length >= 1 ? where : undefined,

      skip: skip,
      take: take,
      order: orderby,
    };
  };

  private getTransactionType = (type?: string): TransactionType | undefined => {
    if (type === 'deposite') return 'deposite';
    if (type === 'localTransfer') return 'localeTransfer';
    if (type === 'globalTransfer') return 'globalTransfer';
    if (type === 'withdraw') return 'withdraw';
    return;
  };

  private getOrderBy = (
    orderBy?: string,
    order: OrderType = 'desc'
  ): FindOptionsOrder<TransactionEntity> | undefined => {
    if (orderBy === 'amount') return { amount: order };
    return { date: order };
  };
}
