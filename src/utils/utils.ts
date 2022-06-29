import bcrypt from 'bcrypt';
import { IGetUserDto } from '../modules/user/models/user.dto';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from '../modules/user';
import express from 'express';
import { ICommonQueryParams } from '../common/common.queryparams';
import { Logger } from './logger';
export const kSaltRounds: number = 10;
export const kPrivateKey = process.env.PRIVATE_KEY ?? 'Empty';
export async function generateSalt(): Promise<string> {
  return bcrypt.genSalt(kSaltRounds);
}

export async function encryptePassowrd(password: string): Promise<string> {
  const salt = await generateSalt();
  const encryptedPassword = await bcrypt.hash(password, salt);
  return encryptedPassword;
}

export async function comparePassword(
  password: string,
  encryptedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, encryptedPassword);
}

export function getJwtToken(
  user: Partial<UserEntity>,
  signOptions?: jwt.SignOptions
): string {
  const token = jwt.sign(
    { ...user },
    kPrivateKey,
    signOptions ?? {
      expiresIn: '7d',
    }
  );
  return 'Bearer ' + token;
}

export const setTotalPagesHeader = (
  res: express.Response,
  query: any,
  count: number
): void => {
  const limit = parseInt(query.limit || '10');
  res.setHeader('total-pages', Math.ceil(count / limit));
  res.setHeader('count', count);
};

export function getPagination(params: ICommonQueryParams) {
  const limit = Number.parseInt(params.limit ?? '10');
  let page = Number.parseInt(params.page ?? '1');
  page = page === 1 ? 0 : page - 1;
  Logger.info({ page, limit });
  return {
    skip: page > 0 ? page * limit : 0,
    take: page >= 0 ? limit : undefined,
  };
}
