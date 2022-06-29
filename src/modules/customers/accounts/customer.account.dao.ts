import { DeepPartial, FindOneOptions, FindManyOptions } from 'typeorm';
import { ICommonDao } from '../../../common/common.dao';
import { AccountEntity } from './customer.account.entity';

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
