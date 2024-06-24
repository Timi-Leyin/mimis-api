import { Module } from '@nestjs/common';
import { profileController } from './profile.controller';
import { PrismaService } from 'src/prisma.service';
import { profileService } from './profile.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [profileController],
  providers: [PrismaService, profileService, AuthService],
})
export class ProfileModule {}
