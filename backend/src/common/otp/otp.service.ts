import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OtpType } from 'generated/prisma/enums';
import otpGenerator from 'otp-generator';
import { AppError } from '../utils/app-error.utils';

@Injectable()
export class OtpService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(userId: string, type: OtpType): Promise<string> {
    const code = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + 10);

    await this.prisma.otp.create({
      data: { userId, code, type, expiredAt },
    });

    return code;
  }

  async verify(code: string, type: OtpType, userId: string): Promise<boolean> {
    console.log(userId);

    const otp = await this.prisma.otp.findFirst({
      where: {
        code,
        userId,
        type,
        isUsed: false,
        expiredAt: { gte: new Date() },
      },
    });

    if (!otp) {
      throw AppError.badRequest({ message: 'Invalid or expired OTP code' });
    }

    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { isUsed: false },
    });

    return true;
  }
}
