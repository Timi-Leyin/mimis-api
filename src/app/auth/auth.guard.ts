import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { COOKIE_KEY } from 'src/config/constants';
import responseObject from 'src/helpers/response-object';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { cookies } = request;
    const sid = cookies[COOKIE_KEY];

    const response = new UnauthorizedException(
      responseObject({ message: 'Unauthorized' }),
    );
    
    if (!cookies || !sid) {
      throw response;
    }

    let decoded;
    try {
      decoded = this.jwtService.verify(sid);
    } catch (error) {
      throw response;
    }

    if (!decoded || !decoded.id) {
      throw response;
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      throw response;
    }

    request.user = user;
    return true;
  }
}
