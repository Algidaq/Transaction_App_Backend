import { IGetRoleDto } from '../../role/role.dto';
import {
  DeepPartial,
  FindManyOptions,
  Equal,
  Not,
  FindOptionsWhere,
} from 'typeorm';
import { RoleEntity } from '../../role/role.entity';
import { number } from 'joi';
import { UserEntity } from '../entity/user.entity';
import express from 'express';

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
export interface UserQueryParams {
  fullname?: string;
  roleId?: string;
  page?: string;
  limit?: string;
  orderBy?: string;
  order?: 'desc' | 'asc';
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

export function getUserFindMany(
  queryParams: UserQueryParams
): FindManyOptions<UserEntity> {
  let limit = parseInt(queryParams.limit ?? '10');
  let page = parseInt(queryParams.page ?? '0');
  page = page === 1 ? 0 : page - 1;
  console.log(queryParams.roleId);
  const where: FindOptionsWhere<UserEntity>[] = [];
  if (queryParams.fullname !== undefined)
    where.push({ fullName: queryParams.fullname });
  if (queryParams.roleId)
    where.push({ role: { id: Number.parseInt(queryParams.roleId) } });
  return {
    where: where.length > 0 ? where : undefined,
    select: ['fullName', 'id', 'createDate', 'phone', 'role', 'updateDate'],
    skip: page > 0 ? page * limit : 0,

    take: page >= 0 ? limit : undefined,
    order: !queryParams.orderBy
      ? { createDate: 'desc' }
      : {
          createDate:
            queryParams.orderBy === 'create_date'
              ? queryParams.order ?? 'desc'
              : undefined,
          fullName:
            queryParams.orderBy === 'full_name'
              ? queryParams.order ?? 'desc'
              : undefined,
        },
  };
}
