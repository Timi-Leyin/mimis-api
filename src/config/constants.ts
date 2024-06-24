import { JwtSignOptions } from '@nestjs/jwt';
import { CookieOptions } from 'express';

export const COOKIE_KEY = 's:id';

export const COOKIE_OPTION: CookieOptions = {
  expires: new Date(Date.now() + 90000000),
};

export const JWT_OPTIONS:JwtSignOptions = {
  expiresIn: '7d',
};

export const CWD = process.cwd()

export const AVATAR_URL = "https://api.dicebear.com/9.x/avataaars/svg"
export const UPLOADFLY_URL = "https://api.uploadfly.cloud/upload";