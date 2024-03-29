import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ICommonDao } from '../../../common/common.dao';
import ApplicationDataSource from '../../../database/database';
import { UserEntity } from '../entity/user.entity';
import { ICreateUserDto } from './user.dto';
export class UserDao extends ICommonDao<UserEntity> {
  constructor() {
    super(UserEntity);
  }
  addResource(resource: ICreateUserDto): Promise<UserEntity> {
    return this.repo.save(resource);
  }
  findSingleResource(
    option: FindOneOptions<UserEntity>
  ): Promise<UserEntity | null> {
    return this.repo.findOne(option);
  }

  getAllResources(
    options?: FindManyOptions<UserEntity> | undefined
  ): Promise<UserEntity[]> {
    return this.repo.find(options);
  }

  getAllResourcesAndCount(
    options?: FindManyOptions<UserEntity> | undefined
  ): Promise<[UserEntity[], number]> {
    return this.repo.findAndCount(options);
  }
  deleteResource(resource: UserEntity): Promise<UserEntity> {
    return this.repo.remove(resource);
  }
  updateResource(resource: UserEntity): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
}
