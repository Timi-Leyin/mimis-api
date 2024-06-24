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
import { file, user } from '@prisma/client';
import { CheckUserType } from './auth.types';
import { getAvatar } from 'src/helpers/get-avatar';
import { uploadFile } from 'src/helpers/uploader';
import * as fs from 'fs';
import { UploadApiResponse } from 'cloudinary';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async checkUser({ email, username }: Partial<CheckUserType>) {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      include: {
        password: true,
      },
    });
  }

  async checkUserIdentity(identity: Partial<CheckUserType>) {
    if (!identity.email && !identity.username) {
      throw new BadRequestException(
        responseObject({
          message: 'Username or Email is Required',
        }),
      );
    }
    const user = await this.checkUser(identity);
    if (user) {
      throw new ConflictException(
        responseObject({
          message: `${user.email == identity.email ? 'Email' : 'Username'} is already taken`,
        }),
      );
    }

    return responseObject({
      message: `${identity.email || identity.username} Is Available`,
    });
  }

  async createUser({
    password,
    email,
    username,
    avatar,
  }: {
    password: string;
    email: string;
    username: string;
    avatar?: UploadApiResponse;
  }): Promise<user> {
    const $password = await hashPassword(password);
    const user = await this.prismaService.user.create({
      data: {
        email,
        username,
        avatar: avatar
          ? {
              create: {
                src: avatar.secure_url,
                type: avatar.resource_type,
                provider: 'cloudinary',
              },
            }
          : undefined,
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
    const avatar = await getAvatar(username);
    const user = await this.createUser({ username, email, password, avatar });
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
