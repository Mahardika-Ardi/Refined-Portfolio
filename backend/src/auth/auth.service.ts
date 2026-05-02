import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/common/hash/hash.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AppError } from 'src/common/utils/app-error.utils';
import { LoggerService } from 'src/common/logger/logger.service';
import { loginSelect, registerSelect } from './auth-select';
import { LogInDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly hash: HashService,
    private readonly jwt: JwtService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(AuthService.name);
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { email: true },
    });

    if (existing?.email == dto.email) {
      this.logger.warn('Register attempt with existing email', {
        email: dto.email,
      });
      throw AppError.conflict('Email', {
        message: 'E - Mail is already used, try another!',
      });
    }

    const hashedPassword = await this.hash.hash(dto.password);

    const user = await this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
      select: registerSelect,
    });

    this.logger.log('User registered', { userId: user.id, email: user.email });

    return user;
  }

  async login(dto: LogInDto) {
    const check = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
      select: loginSelect,
    });

    if (!check) {
      throw AppError.unauthorized('Invalid', {
        message: 'Invalid Credentials',
      });
    }
  }
}
