import { CustomerDao } from './customer.dao';
import { CurrencyDao } from '../currency/currency.dao';
import { CurrencyEntity } from '../currency/currency.entity';
import { AccountDao } from './accounts/customer.account.dao';
import {
  getAccountsQueryParams,
  IGetCustomerDto,
  IGetAccountDto,
} from './customer.dto';
import {
  getCustomerQueryParams,
  ICreateCustomerAccountDto,
} from './customer.dto';
import { CustomerEntity } from './customer.entity';
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
