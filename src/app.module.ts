import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AuthModule from './app/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_OPTIONS } from './config/constants';
import { ProfileModule } from './app/profile/profile.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: JWT_OPTIONS,
    }),
    AuthModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
