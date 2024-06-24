import { Controller, Get, Param, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { profileService } from './profile.service';

@Controller('profile')
@UseGuards(AuthGuard)
export class profileController {
  constructor(readonly profileService: profileService) {}
  @Get('me')
  async myProfile(@Req() request: Request) {
    return request.user;
  }
  @Get('users/:username')
  async usersProfile(@Param("username") username:string) {
    return this.profileService.usersProfile(username);
  }
}
