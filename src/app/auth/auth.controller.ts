import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CheckUserDto, LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    readonly prismaService: PrismaService,
    readonly authService: AuthService,
  ) {}
  @Post('check-user')
  async checkUser(@Body() body: CheckUserDto) {
    return this.authService.checkUserIdentity(body)
  }
  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.register(body, response);
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(body, response);
  }
}
