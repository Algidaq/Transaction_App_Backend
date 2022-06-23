import { UserEntity } from '../entity/user.entity';
import { IGetRoleDto } from '../../role/role.dto';
import { DeepPartial } from 'typeorm';
import { RoleEntity } from '../../role/role.entity';

export interface ICreateUserDto {
  fullName: string;
  phone: string;
  password: string;
  role: IGetRoleDto;
}

export interface IGetUserDto {
  id: string;
  fullName: string;
  phone: string;
  role: RoleEntity;
  updateDate: string;
}
/**
 * takes request body and converted to user
 * @param requestBody
 * @returns {Promise<ICreateUserDto>}
 */
export function getUserDto(requestBody: any): ICreateUserDto {
  const json = { ...requestBody };
  return <ICreateUserDto>{
    fullName: json['fullName'],
    phone: json['phone'],
    password: json['password'],
    role: {
      id: json['role']['id'],
      role: json['role']['name'],
    },
  };
}
