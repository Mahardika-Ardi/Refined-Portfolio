import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from 'src/infra/logger/logger.service';
import { MailService } from 'src/infra/mail/mail.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { BlacklistService } from 'src/modules/auth/blacklist/blacklist.service';

import { OtpService } from '../otp/otp.service';
import { AuthService } from './auth.service';
import { PasswordService } from './security/password.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: {} },
        { provide: PasswordService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: OtpService, useValue: {} },
        { provide: MailService, useValue: {} },
        { provide: BlacklistService, useValue: {} },
        { provide: LoggerService, useValue: { setContext: () => ({}) } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
