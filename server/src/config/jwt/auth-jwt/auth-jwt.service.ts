import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async generateAccessToken(userId: string, email: string): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },

      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.signOptions.expiresIn,
      },
    );
  }
}
