import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';

export const generateToken = (payload: object): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = (process.env.JWT_EXPIRE || '7d') as StringValue;
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};