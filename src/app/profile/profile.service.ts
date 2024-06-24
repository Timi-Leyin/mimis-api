import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import responseObject from 'src/helpers/response-object';
import { PrismaService } from 'src/prisma.service';
import { UpdateProfileDto } from './profile.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class profileService {
  constructor(
    readonly prismaService: PrismaService,
    readonly authService: AuthService,
  ) {}
  async usersProfile(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new NotFoundException(
        responseObject({
          message: 'User with Username not Found',
        }),
      );
    }

    return responseObject({
      message: 'User Retrieved',
      data: user,
    });
  }

  async updateProfile(id: string, body: UpdateProfileDto) {
    const { username } = body;
    const checkUser = await this.authService.checkUser({
      username,
      email: undefined,
    });

    if (checkUser) {
      throw new BadRequestException(
        responseObject({
          message: 'Username is already Taken',
        }),
      );
    }

    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        username,
      },
    });

    return responseObject({
      message: 'Profile Updated Successfully',
      data: user,
    });
  }
}
