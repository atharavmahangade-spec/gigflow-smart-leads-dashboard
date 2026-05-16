import jwt from 'jsonwebtoken';
import { IUserPayload } from '../types';

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return secret;
};

export const generateToken = (payload: IUserPayload): string => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) ?? '7d',
  });
};

export const verifyToken = (token: string): IUserPayload => {
  return jwt.verify(token, getSecret()) as IUserPayload;
};
