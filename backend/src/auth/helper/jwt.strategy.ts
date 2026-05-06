import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BlacklistService } from 'src/common/blacklist/blacklist.service';
import { Request } from 'express';

type Payload = {
  id: string;
  email: string;
  phone: string;
  role: Role;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly blacklist: BlacklistService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => (req?.cookies?.['access_token'] as string) ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY!,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: Payload) {
    const token = req.cookies['access_token'] as string;

    const blacklisted = await this.blacklist.isBlacklist(token);

    if (blacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return payload;
  }
}
