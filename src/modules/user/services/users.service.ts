import { ICommonDao } from '../../../common/common.dao';
import { UserEntity } from '../entity/user.entity';
import { getUserDto } from '../models/user.dto';
import bcrypt from 'bcrypt';
import { encryptePassowrd, kSaltRounds } from '../../../utils/utils';
import { UserDao } from '../models/user.dao';
export class UserService {
  constructor(private dao: ICommonDao<UserEntity> = new UserDao()) {}

  async addResource(body: any): Promise<UserEntity> {
    const userDto = getUserDto(body);
    const password = await encryptePassowrd(userDto.password);
    userDto.password = password;
    return await this.dao.addResource(userDto);
  }

  async findSingleResource(params: any): Promise<UserEntity | null> {
    console.log(params);
    const id: string = params?.id ?? '';
    if (id === '') return null;
    const entity = await this.dao.findSingleResource({
      where: { id: id },
    });
    return entity;
  }
}
