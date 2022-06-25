import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ICommonDao } from '../../common/common.dao';
import { RoleEntity } from './role.entity';
export class RoleDao extends ICommonDao<RoleEntity> {
  constructor() {
    super(RoleEntity);
  }

  getAllResources(
    options?: FindManyOptions<RoleEntity> | undefined
  ): Promise<RoleEntity[]> {
    return this.repo.find();
  }

  addResource(resource: string): Promise<RoleEntity> {
    return this.repo.save({ role: resource });
  }

  findSingleResource(
    option: FindOneOptions<RoleEntity>
  ): Promise<RoleEntity | null> {
    return this.repo.findOne(option);
  }
  getAllResourcesAndCount(
    options?: FindManyOptions<RoleEntity> | undefined
  ): Promise<[RoleEntity[], number]> {
    return this.repo.findAndCount(options);
  }

  deleteResource(resource: RoleEntity): Promise<RoleEntity> {
    return this.repo.remove(resource);
  }
  updateResource(resource: RoleEntity): Promise<RoleEntity> {
    throw new Error('Method not implemented.');
  }
}
