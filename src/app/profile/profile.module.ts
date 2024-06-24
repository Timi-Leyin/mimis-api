import { Module } from '@nestjs/common';
import { profileController } from './profile.controller';
import { PrismaService } from 'src/prisma.service';
import { profileService } from './profile.service';

@Module({
  controllers: [profileController],
  providers: [PrismaService, profileService],
})
export class ProfileModule {}
