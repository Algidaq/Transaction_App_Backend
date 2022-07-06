import { IGetRoleDto } from '../../role/role.dto';
import {
  DeepPartial,
  FindManyOptions,
  Equal,
  Not,
  FindOptionsWhere,
  Like,
} from 'typeorm';
import { RoleEntity } from '../../role/role.entity';
import { number } from 'joi';
import { UserEntity } from '../entity/user.entity';
import express from 'express';
import { ICommonQueryParams } from '../../../common/common.queryparams';
import { getPagination } from '../../../utils/utils';
import { Logger } from '../../../utils/logger';

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
  phone?: string;
}
/**
 * takes request body and converted to user
 * @param requestBody
 * @returns {Promise<ICreateUserDto>}
 */
export function getUserDto(requestBody: any): ICreateUserDto {
  const json = { ...requestBody };
  return {
    fullName: json.fullName,
    phone: json.phone,
    password: json.password,
    role: {
      id: json.role.id,
      role: json.role.name,
    },
  };
}

export function getUserFindMany(
  queryParams: UserQueryParams
): FindManyOptions<UserEntity> {
  const { skip, take } = getPagination(queryParams);
  Logger.info(queryParams.roleId);
  const where: FindOptionsWhere<UserEntity>[] = [];
  if (queryParams.fullname !== undefined)
    where.push({ fullName: Like(`%${queryParams.fullname}%`) });
  if (queryParams.phone !== undefined)
    where.push({ phone: Like(`%${queryParams.phone}%`) });
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
            queryParams.orderBy === 'createDate'
              ? queryParams.order ?? 'desc'
              : undefined,
          fullName:
            queryParams.orderBy === 'fullName'
              ? queryParams.order ?? 'desc'
              : undefined,
        },
  };
}
