import { FindOneOptions, FindManyOptions, DeepPartial } from 'typeorm';
import { ICommonDao } from '../../common/common.dao';
import { CurrencyEntity } from './currency.entity';

export class CurrencyDao extends ICommonDao<CurrencyEntity> {
  constructor() {
    super(CurrencyEntity);
  }
  addResource(resource: DeepPartial<CurrencyEntity>): Promise<CurrencyEntity> {
    return this.repo.save(resource);
  }
  findSingleResource(
    option: FindOneOptions<CurrencyEntity>
  ): Promise<CurrencyEntity | null> {
    return this.repo.findOne(option);
  }
  getAllResources(
    options?: FindManyOptions<CurrencyEntity> | undefined
  ): Promise<CurrencyEntity[]> {
    return this.repo.find(options);
  }
  getAllResourcesAndCount(
    options?: FindManyOptions<CurrencyEntity> | undefined
  ): Promise<[CurrencyEntity[], number]> {
    return this.repo.findAndCount(options);
  }
  deleteResource(resource: CurrencyEntity): Promise<CurrencyEntity> {
    return this.repo.remove(resource);
  }

  updateResource(resource: CurrencyEntity): Promise<CurrencyEntity> {
    return this.repo.save(resource);
  }
}
