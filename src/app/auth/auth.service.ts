import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import responseObject from 'src/helpers/response-object';
import { PrismaService } from 'src/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { hashPassword, verifyPassword } from 'src/helpers/password';
import { Response } from 'express';
import { COOKIE_KEY } from 'src/config/constants';
import { COOKIE_OPTION } from 'src/config/constants';
import { JwtService } from '@nestjs/jwt';
import { user } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async checkUser({ email, username }: { email: string; username: string }) {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      include: {
        password: true,
      },
    });
  }

  async createUser({ password, email, username }): Promise<user> {
    const $password = await hashPassword(password);
    const user = await this.prismaService.user.create({
      data: {
        email,
        username,
        password: {
          create: {
            hash: $password,
          },
        },
      },
    });
    return user;
  }

  async register(
    { username, email, password }: RegisterDto,
    response: Response,
  ) {
    const exists = await this.checkUser({ email, username });
    if (exists) {
      throw new BadRequestException(
        responseObject({
          message: `${exists.email == email ? 'Email' : 'Username'} is already Taken`,
        }),
      );
    }
    const user = await this.createUser({ username, email, password });
    const payload = { id: user.id, sid: Date.now() };
    const token = await this.jwtService.signAsync(payload);
    response.cookie(COOKIE_KEY, token, COOKIE_OPTION);
    return responseObject({
      message: 'User Registered Successfully',
    });
  }

  async login({ email, password }: LoginDto, response: Response) {
    const exists = await this.checkUser({ email, username: undefined });
    if (!exists) {
      throw new BadRequestException(
        responseObject({
          message: `No Account Associated with this email`,
        }),
      );
    }

    // compare passwords
    const isValid = await verifyPassword(password, exists.password.hash);
    if (!isValid) {
      throw new BadRequestException(
        responseObject({
          message: `Check Password and Try again`,
        }),
      );
    }
    const payload = { id: exists.id, sid: Date.now() };
    const token = await this.jwtService.signAsync(payload);
    response.cookie(COOKIE_KEY, token, COOKIE_OPTION);
    return responseObject({
      message: 'User Login Successfully',
    });
  }
}
