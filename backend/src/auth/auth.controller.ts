import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { LogInDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OtpDto } from './dto/token.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @Throttle({ global: { limit: 10, ttl: 60000 } })
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return {
      message: 'Register Successfully',
      data,
    };
  }

  @Public()
  @Post('login')
  @Throttle({ global: { limit: 5, ttl: 60000 } })
  async login(
    @Body() dto: LogInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(dto, res);
    return {
      message: data,
    };
  }

  @Post('logout')
  @SkipThrottle()
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['access_token'] as string;
    const data = await this.authService.logout(token, res);
    return {
      message: data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-otp')
  async refreshOtp(@CurrentUser('id') id: string, @Body() dto: OtpDto) {
    const data = await this.authService.refreshOtp(id, dto);
    return { message: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('forgot-password')
  async forgotPassword(@CurrentUser('id') id: string) {
    const data = await this.authService.forgotPassword(id);
    return { message: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(
    @CurrentUser('id') id: string,
    @Body() dto: ResetPasswordDto,
  ) {
    const data = await this.authService.resetPassword(id, dto);
    return { message: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-verification-email')
  async sendVerificationEmail(@CurrentUser('id') id: string) {
    const data = await this.authService.sendVerificationEmail(id);
    return { message: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  async VerifyEmail(
    @CurrentUser('id') id: string,
    @Body() dto: VerifyEmailDto,
  ) {
    const data = await this.authService.VerifyEmail(id, dto);
    return { message: data };
  }
}
