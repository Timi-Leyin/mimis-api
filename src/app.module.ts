import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AuthModule from './app/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_OPTIONS } from './config/constants';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: JWT_OPTIONS ,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
