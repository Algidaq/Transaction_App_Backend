import { CurrencyEntity } from '../../currency/currency.entity';
import { CustomerDao } from '../customer.dao';
import { CustomerEntity } from '../customer.entity';
import { getAccountsQueryParams } from '../customer.dto';
import { InsertResult } from 'typeorm';
import { AccountEntity } from './customer.account.entity';
import { AccountDao } from './customer.account.dao';
export class CustomerAccountService {
  constructor(
    private customerDao: CustomerDao = new CustomerDao(),
    private accountDao: AccountDao = new AccountDao()
  ) {}

  addResource = async (
    body: any,
    customer: CustomerEntity
  ): Promise<InsertResult> => {
    const currency: CurrencyEntity | undefined = body.currency;
    const balance: number | undefined = body.balance ?? 0.0;
    return this.accountDao.repo.insert({
      currency,
      customerId: customer.id,
      balance: balance ?? 0.0,
    });
  };
  /**
   *
   * @param params
   * @returns  all accounts by customer
   */
  getAccountsByCustomerId = async (params: any): Promise<AccountEntity[]> => {
    const customerId: string | undefined = params.id;
    return this.accountDao.getAllResources({
      where: { customerId },
      select: [
        'id',
        'balance',
        'currency',
        'customerId',
        'updateDate',
        'createDate',
      ],
      loadRelationIds: false,
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

  getAccountById = async (id: string) => {
    return this.accountDao.findSingleResource({
      where: { id },
      select: [
        'id',
        'balance',
        'currency',
        'updateDate',
        'createDate',
        'customerId',
        'currencyId',
      ],
      loadRelationIds: false,
    });
  };
}
