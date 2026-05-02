import { Injectable } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type Payload = {
  id: string;
  email: string;
  phone: string;
  role: Role;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY!,
    });
  }

  validate(payload: Payload) {
    return payload;
  }
}
