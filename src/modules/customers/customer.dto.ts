import { CurrencyEntity } from '../currency/currency.entity';
import { ICommonQueryParams } from '../../common/common.queryparams';
import { getPagination } from '../../utils/utils';
import { FindOptionsWhere, FindManyOptions, Like, Not } from 'typeorm';
import { CustomerDao } from './customer.dao';
import { CustomerEntity } from './customer.entity';
import { AccountEntity } from './accounts/customer.account.entity';
export interface ICreateCustomerDto {
  fullName: string;
  phone: string;
  accounts?: ICreateCustomerAccountDto[];
}
export interface IUpdateCustomerDto {
  fullName?: string;
  phone?: string;
}
export interface ICreateCustomerAccountDto {
  balance?: number;
  currency: CurrencyEntity;
}

export interface IUpdateCustomerAccountDto {
  id: number;
  balance: number;
}
export interface IGetCustomerDto {
  id: string;
  fullName: string;
  phone: string;
  accounts: IGetAccountDto[];
  isRemoved: boolean;
  updateDate: string;
}
export interface IGetAccountDto {
  id: string;
  balance: number;
  currency: CurrencyEntity;
  updateDate: string;
  createDate: string;
}
export interface ICustomerQueryParams extends ICommonQueryParams {
  /**
   * used to search customer by is fullname
   */
  fullname?: string;
  /**
   * search customers base on phone value
   */
  phone?: string;
}
export interface IAccountQueryParams extends ICommonQueryParams {
  customerId?: string;
  id?: string;
  currencyId?: number;
}

export function getCustomerQueryParams(
  params: ICustomerQueryParams
): FindManyOptions<CustomerEntity> {
  const { take, skip } = getPagination(params);
  const where: FindOptionsWhere<CustomerEntity> = {
    fullName: params.fullname ? Like(`%${params.fullname}%`) : Not(''),
    phone: params.phone ? Like(`%${params.phone}%`) : Not(''),
    isRemoved: false,
  };

  return {
    where: where,
    skip: skip,
    take: take,
    order: { createDate: 'asc' },
  };
}

export function getAccountsQueryParams(
  params: IAccountQueryParams
): FindManyOptions<AccountEntity> {
  const { take, skip } = getPagination(params);
  const where: FindOptionsWhere<AccountEntity>[] = [];
  if (params.currencyId) where.push({ currencyId: params.currencyId });
  if (params.customerId) where.push({ customerId: params.customerId });
  return {
    where: where.length > 0 ? where : undefined,
    skip: skip,
    take: take,
    order: { createDate: 'asc' },
  };
}
