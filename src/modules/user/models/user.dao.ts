import { FindOneOptions, Repository } from 'typeorm';
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
}
