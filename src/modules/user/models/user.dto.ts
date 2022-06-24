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
import { ICommonQueryParams } from '../../../common/common.queryparams';
import { getPagination } from '../../../utils/utils';

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
export interface UserQueryParams extends ICommonQueryParams {
  fullname?: string;
  roleId?: string;
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
  const { skip, take } = getPagination(queryParams);
  console.log(queryParams.roleId);
  const where: FindOptionsWhere<UserEntity>[] = [];
  if (queryParams.fullname !== undefined)
    where.push({ fullName: queryParams.fullname });
  if (queryParams.roleId)
    where.push({ role: { id: Number.parseInt(queryParams.roleId) } });
  return {
    where: where.length > 0 ? where : undefined,
    select: ['fullName', 'id', 'createDate', 'phone', 'role', 'updateDate'],
    skip: skip,

    take: take,
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
