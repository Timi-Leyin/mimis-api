import { Injectable, NotFoundException } from '@nestjs/common';
import responseObject from 'src/helpers/response-object';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class profileService {
  constructor(readonly prismaService: PrismaService) {}
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
}
