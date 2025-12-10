import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    const publicKey = configService.getOrThrow<string>('JWT_PUBLIC_KEY');
    let formattedPublicKey = publicKey.replace(/\\n/g, '\n');
    if (!formattedPublicKey.includes('\n')) {
      formattedPublicKey = formattedPublicKey
        .replace('-----BEGIN PUBLIC KEY-----', '-----BEGIN PUBLIC KEY-----\n')
        .replace('-----END PUBLIC KEY-----', '\n-----END PUBLIC KEY-----');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.cookies?.refresh_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: formattedPublicKey,
      algorithms: ['RS256'],
      passReqToCallback: true,
    } as any);
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('REFRESH_TOKEN_REQUIRED');
    }

    return {
      id: payload.sub,
      username: payload.username,
      refreshToken,
      jti: payload.jti,
    };
  }
}
