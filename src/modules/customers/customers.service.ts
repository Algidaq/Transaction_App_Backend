import { CustomerDao } from './customer.dao';
import { CurrencyDao } from '../currency/currency.dao';
import { CurrencyEntity } from '../currency/currency.entity';
import { AccountDao } from './accounts/customer.account.dao';
import {
  getAccountsQueryParams,
  IGetCustomerDto,
  IGetAccountDto,
  ICreateCustomerDto,
} from './customer.dto';
import {
  getCustomerQueryParams,
  ICreateCustomerAccountDto,
} from './customer.dto';
import { CustomerEntity } from './customer.entity';
import { Logger } from '../../utils/logger';
import { AccountEntity } from './accounts/customer.account.entity';
import { ICustomerQueryParams, IUpdateCustomerDto } from './customer.dto';
import { getPagination } from '../../utils/utils';
import { Like } from 'typeorm';
export class CustomerService {
  constructor(
    private customerDao: CustomerDao = new CustomerDao(),
    private accountDao: AccountDao = new AccountDao()
  ) {}

  addResource = async (body: any): Promise<CustomerEntity> => {
    return this.customerDao.addResource(body);
  };

  getAllCustomers = async (queryParams: any): Promise<CustomerEntity[]> => {
    const options = getCustomerQueryParams(queryParams);
    return this.customerDao.getAllResources(options);
  };

  getAllCustomersAndCount = async (
    queryParams: ICustomerQueryParams
  ): Promise<[CustomerEntity[], number]> => {
    const { skip, take } = getPagination(queryParams);
    const query = this.customerDao.repo
      .createQueryBuilder('customer')
      .select()
      .leftJoinAndSelect('customer.accounts', 'accounts')
      .leftJoinAndSelect('accounts.currency', 'currency')
      .skip(skip)
      .take(take);

    if (queryParams.fullname)
      query.orWhere(`full_name like('%${queryParams.fullname}%')`);
    if (queryParams.phone)
      query.orWhere(`phone like('%${queryParams.phone}%')`);

    query.andWhere('customer.is_removed <> 1');
    Logger.warn(query.getSql());
    return query.getManyAndCount();
  };

  getCustomer = async (params: any): Promise<CustomerEntity | null> => {
    const id = params.id ?? 'N/A';
    return this.customerDao.findSingleResource({
      where: { id: id },
    });
  };

  deleteCustomer = async (
    customer: CustomerEntity
  ): Promise<CustomerEntity> => {
    customer.isRemoved = true;
    return this.customerDao.repo.query(
      `update customers set is_removed=1 where id='${customer.id}'`
    );
  };

  updateCustomer = async (
    customer: CustomerEntity,
    body: IUpdateCustomerDto
  ): Promise<CustomerEntity> => {
    customer.phone = body.phone ?? customer.phone;
    customer.fullName = body.fullName ?? customer.fullName;
    return this.customerDao.updateResource(customer);
  };

  getFormattedCustomerEntity = (
    customers: CustomerEntity[]
  ): IGetCustomerDto[] => {
    return customers.map<IGetCustomerDto>((element, index) => {
      return {
        id: element.id,
        fullName: element.fullName,
        phone: element.phone,
        isRemoved: element.isRemoved,
        accounts: element.accounts.map<IGetAccountDto>((account) => {
          return {
            id: account.id,
            balance: account.balance,
            currency: account.currency,
            updateDate: account.updateDate,
            createDate: account.createDate,
          };
        }),
        updateDate: element.updateDate,
      };
    });
  };
}
