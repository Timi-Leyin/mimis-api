import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { profileService } from './profile.service';
import { UpdateProfileDto } from './profile.dto';

@Controller('profile')
@UseGuards(AuthGuard)
export class profileController {
  constructor(readonly profileService: profileService) {}
  @Get('me')
  async myProfile(@Req() request: Request) {
  return request.user;
  }

  @Put('me')
  async updateProfile(@Req() request: Request, @Body() body: UpdateProfileDto) {
    return this.profileService.updateProfile(request.user.id, body);
  }

  @Get('users/:username')
  async usersProfile(@Param('username') username: string) {
    return this.profileService.usersProfile(username);
  }
}
