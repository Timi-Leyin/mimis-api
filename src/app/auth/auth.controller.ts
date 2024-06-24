import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    readonly prismaService: PrismaService,
    readonly authService: AuthService,
  ) {}
  @Post('register')
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.register(body, response);
  }
}
