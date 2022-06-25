import { CustomerDao, AccountDao } from './customer.dao';
import { CustomerEntity, AccountEntity } from './customer.entity';
import { CurrencyDao } from '../currency/currency.dao';
import { CurrencyEntity } from '../currency/currency.entity';
import {
  getAccountsQueryParams,
  IGetCustomerDto,
  IGetAccountDto,
} from './customer.dto';
import {
  getCustomerQueryParams,
  ICreateCustomerAccountDto,
} from './customer.dto';
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
    queryParams: any
  ): Promise<[CustomerEntity[], number]> => {
    const options = getCustomerQueryParams(queryParams);
    return this.customerDao.getAllResourcesAndCount({
      ...options,
      loadEagerRelations: true,
    });
  };

  getCustomer = async (params: any): Promise<CustomerEntity | null> => {
    const id = params.id ?? 'N/A';
    return this.customerDao.findSingleResource({ where: { id: id } });
  };

  getFormattedCustomerEntity = (
    customers: CustomerEntity[]
  ): IGetCustomerDto[] => {
    return customers.map<IGetCustomerDto>((element, index) => {
      return {
        id: element.id,
        fullName: element.fullName,
        phone: element.phone,
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

export class CustomerAccountService {
  constructor(
    private customerDao: CustomerDao = new CustomerDao(),
    private accountDao: AccountDao = new AccountDao()
  ) {}

  addResource = async (
    body: any,
    customerId: string
  ): Promise<AccountEntity | null> => {
    const customer = await this.customerDao.findSingleResource({
      where: { id: customerId },
    });
    if (!customer) return null;
    const currency: CurrencyEntity | undefined = body.currency;
    if (!currency) return null;
    const balance: number | undefined = body.balance ?? 0.0;
    return await this.accountDao.addResource({
      currency: currency,
      customer: customer,
      balance: balance ?? 0.0,
    });
  };

  getAccountsByCustomerId = async (
    params: any
  ): Promise<AccountEntity | null> => {
    const id: string | undefined = params.id;
    const customerId: string | undefined = params.customerId;
    return this.accountDao.findSingleResource({
      where: { id: id, customerId: customerId },
    });
  };

  getAllAccounts = async (params: any): Promise<AccountEntity[]> => {
    const options = getAccountsQueryParams(params);
    return this.accountDao.getAllResources({
      ...options,
      skip: 0,
      take: undefined,
    });
  };
}
