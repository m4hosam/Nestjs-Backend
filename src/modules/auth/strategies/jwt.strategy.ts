import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/services/users.service';

export interface JwtPayload {
  sub: number;
  username: string;
  roles: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const publicKey = configService.getOrThrow<string>('JWT_PUBLIC_KEY');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: publicKey.replace(/\\n/g, '\n'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('USER_NOT_FOUND');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('USER_INACTIVE');
    }

    return {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
