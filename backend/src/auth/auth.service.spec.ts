import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { HashService } from 'src/common/hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/common/otp/otp.service';
import { MailService } from 'src/common/mail/mail.service';
import { BlacklistService } from 'src/common/blacklist/blacklist.service';
import { LoggerService } from 'src/common/logger/logger.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: {} },
        { provide: HashService, useValue: {} },
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
