// nestjs-request
import { PrismaClient, file, user } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

export interface User extends user {
  avatar: file;
}
declare module '@nestjs/common' {
  interface Request extends ExpressRequest {
    user?: User;
  }
}
