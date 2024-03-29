import { FindOneOptions, FindManyOptions, DeepPartial } from 'typeorm';
import { ICommonDao } from '../../common/common.dao';
import { CustomerEntity } from './customer.entity';
import { ICreateCustomerAccountDto, ICreateCustomerDto } from './customer.dto';
import { AccountEntity } from './accounts/customer.account.entity';
import { AccountDao } from './accounts/customer.account.dao';

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
    return this.repo.softRemove(resource);
  }

  async updateResource(resource: CustomerEntity): Promise<CustomerEntity> {
    const result = await this.repo.update(resource.id, {
      fullName: resource.fullName,
      phone: resource.phone,
    });
    const customer = await this.findSingleResource({
      where: { id: resource.id },
    });
    return customer!;
  }
}
