import {
  FindOneOptions,
  FindManyOptions,
  DeepPartial,
  InsertResult,
} from 'typeorm';
import { ICommonDao } from '../../common/common.dao';
import { TransactionEntity } from './entity/transaction.entity';
import { UserEntity } from '../user/entity/user.entity';

export abstract class ITransactionDao extends ICommonDao<TransactionEntity> {
  constructor() {
    super(TransactionEntity);
  }

  abstract insertNewResource(
    resource: DeepPartial<TransactionEntity>
  ): Promise<InsertResult>;
}

export class TransactionDao extends ITransactionDao {
  constructor() {
    super();
  }
  insertNewResource(
    resource: DeepPartial<TransactionEntity>
  ): Promise<InsertResult> {
    return this.repo.insert(resource);
  }
  addResource(resource: any): Promise<TransactionEntity> {
    return this.repo.save(resource);
  }
  findSingleResource(
    option: FindOneOptions<TransactionEntity>
  ): Promise<TransactionEntity | null> {
    return this.repo.findOne(option);
  }
  getAllResources(
    options?: FindManyOptions<TransactionEntity> | undefined
  ): Promise<TransactionEntity[]> {
    return this.repo.find({ ...options, skip: 0, take: undefined });
  }
  getAllResourcesAndCount(
    options?: FindManyOptions<TransactionEntity> | undefined
  ): Promise<[TransactionEntity[], number]> {
    return this.repo.findAndCount(options);
  }

  deleteResource(resource: TransactionEntity): Promise<TransactionEntity> {
    throw new Error('Method not implemented.');
  }
  updateResource(resource: TransactionEntity): Promise<TransactionEntity> {
    throw new Error('Method not implemented.');
  }
}
