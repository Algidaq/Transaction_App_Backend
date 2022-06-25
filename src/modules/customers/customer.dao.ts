import { FindOneOptions, FindManyOptions, DeepPartial } from 'typeorm';
import { ICommonDao } from '../../common/common.dao';
import { AccountEntity, CustomerEntity } from './customer.entity';
import { ICreateCustomerAccountDto, ICreateCustomerDto } from './customer.dto';

export class CustomerDao extends ICommonDao<CustomerEntity> {
  constructor(private accountDao: AccountDao = new AccountDao()) {
    super(CustomerEntity);
  }
  async addResource(resource: ICreateCustomerDto): Promise<CustomerEntity> {
    const customer = new CustomerEntity();
    customer.fullName = resource.fullName;
    customer.phone = resource.phone;
    await this.repo.save(customer);
    if (!resource.accounts) {
      customer.accounts = [];
      return customer;
    }
    const accounts: AccountEntity[] = [];
    resource.accounts.forEach(async (dto) => {
      const account = new AccountEntity();
      account.balance = dto.balance ?? 0.0;
      account.currency = dto.currency;
      account.customer = customer;
      accounts.push(account);
    });
    customer.accounts = await this.accountDao.repo.save(accounts);
    return customer;
  }
  findSingleResource(
    option: FindOneOptions<CustomerEntity>
  ): Promise<CustomerEntity | null> {
    return this.repo.findOne(option);
  }
  getAllResources(
    options?: FindManyOptions<CustomerEntity> | undefined
  ): Promise<CustomerEntity[]> {
    return this.repo.find(options);
  }
  getAllResourcesAndCount(
    options?: FindManyOptions<CustomerEntity> | undefined
  ): Promise<[CustomerEntity[], number]> {
    return this.repo.findAndCount(options);
  }

  deleteResource(resource: CustomerEntity): Promise<CustomerEntity> {
    throw new Error('Method not implemented.');
  }

  updateResource(resource: CustomerEntity): Promise<CustomerEntity> {
    throw new Error('Method not implemented.');
  }
}

export class AccountDao extends ICommonDao<AccountEntity> {
  constructor() {
    super(AccountEntity);
  }

  addResource(resource: DeepPartial<AccountEntity>): Promise<AccountEntity> {
    return this.repo.save(resource);
  }
  findSingleResource(
    option: FindOneOptions<AccountEntity>
  ): Promise<AccountEntity | null> {
    return this.repo.findOne(option);
  }
  getAllResources(
    options?: FindManyOptions<AccountEntity> | undefined
  ): Promise<AccountEntity[]> {
    return this.repo.find(options);
  }
  getAllResourcesAndCount(
    options?: FindManyOptions<AccountEntity> | undefined
  ): Promise<[AccountEntity[], number]> {
    return this.repo.findAndCount(options);
  }

  deleteResource(resource: AccountEntity): Promise<AccountEntity> {
    throw new Error('Method not implemented.');
  }
  updateResource(resource: AccountEntity): Promise<AccountEntity> {
    return this.repo.save(resource);
  }
}
