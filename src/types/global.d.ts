// nestjs-request
import { PrismaClient, user } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
declare module '@nestjs/common' {
  interface Request extends ExpressRequest {
    user?: user;
  }
}
