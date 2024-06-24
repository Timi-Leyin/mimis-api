import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import responseObject from 'src/helpers/response-object';
import { PrismaService } from 'src/prisma.service';
import { RegisterDto } from './auth.dto';
import { hashPassword } from 'src/helpers/password';
import { Response } from 'express';
import { COOKIE_KEY } from 'src/config/constants';
import { COOKIE_OPTION } from 'src/config/constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async register(
    { username, email, password }: RegisterDto,
    response: Response,
  ) {
    const exists = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (exists) {
      throw new BadRequestException(
        responseObject({
          message: `${exists.email == email ? 'Email' : 'Username'} is already Taken`,
        }),
      );
    }

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

    const payload = { id: user.id, sid: Date.now() };
    const token = await this.jwtService.signAsync(payload);
    response.cookie(COOKIE_KEY, token, COOKIE_OPTION);
    return responseObject({
      message: 'User Registered Successfully',
    });
  }
}
