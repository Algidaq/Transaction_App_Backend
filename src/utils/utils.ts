import bcrypt from 'bcrypt';
import { IGetUserDto } from '../modules/user/models/user.dto';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from '../modules/user';
import express from 'express';
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
  let limit = parseInt(query.limit || '10');
  res.setHeader('total-pages', Math.ceil(count / limit));
  res.setHeader('count', count);
};
