import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { TokensDto } from '../dto/tokens.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<TokensDto & { user: any }> {
    const user = await this.usersService.findByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('USER_INACTIVE');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    const tokens = await this.generateTokens(
      user.id,
      user.username,
      user.roles,
    );

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
    refreshJti: string,
  ): Promise<TokensDto & { user: any }> {
    const user = await this.usersService.findEntityById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
    }

    // Prepare payload check including checking if the refresh JTI matches what we expect if we stored it?
    // Current requirement: "Create refresh_jti along the access atoken and refresh token"
    // And "Create another cookie that contains user details which gets refreshed"

    const tokens = await this.generateTokens(
      user.id,
      user.username,
      user.roles,
    );

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async logout(userId: number): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  private async generateTokens(
    userId: number,
    username: string,
    roles: string[],
  ): Promise<TokensDto> {
    // Check if crypto is available (Node 19+ has global crypto, but import is safer for types)
    const refreshJti = crypto.randomUUID();
    const payload = { sub: userId, username, roles };
    const refreshPayload = { ...payload, jti: refreshJti };

    const privateKey = this.configService.getOrThrow<string>('JWT_PRIVATE_KEY');

    // Robust formatting for PEM key
    let formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
    if (!formattedPrivateKey.includes('\n')) {
      // If no newlines found after replacement (meaning it was a solid single line)
      // Force header/footer newlines
      formattedPrivateKey = formattedPrivateKey
        .replace(
          '-----BEGIN RSA PRIVATE KEY-----',
          '-----BEGIN RSA PRIVATE KEY-----\n',
        )
        .replace(
          '-----END RSA PRIVATE KEY-----',
          '\n-----END RSA PRIVATE KEY-----',
        );
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        privateKey: formattedPrivateKey,
        algorithm: 'RS256',
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRATION',
          '15m',
        ) as any,
      }),
      this.jwtService.signAsync(refreshPayload, {
        privateKey: formattedPrivateKey,
        algorithm: 'RS256',
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRATION',
          '7d',
        ) as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
  }
}
