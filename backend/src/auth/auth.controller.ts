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
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @Throttle({ global: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Register akun baru' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Register berhasil' })
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
  @ApiOperation({ summary: 'Login user dan set access token cookie' })
  @ApiBody({ type: LogInDto })
  @ApiResponse({ status: 201, description: 'Login berhasil' })
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
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Logout user dan hapus access token cookie' })
  @ApiResponse({ status: 201, description: 'Logout berhasil' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['access_token'] as string;
    const data = await this.authService.logout(token, res);
    return {
      message: data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-otp')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Kirim ulang OTP berdasarkan tipe OTP' })
  @ApiBody({ type: OtpDto })
  @ApiResponse({ status: 201, description: 'OTP berhasil dikirim ulang' })
  async refreshOtp(@CurrentUser('id') id: string, @Body() dto: OtpDto) {
    const data = await this.authService.refreshOtp(id, dto);
    return { message: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('forgot-password')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Kirim OTP untuk reset password' })
  @ApiResponse({
    status: 201,
    description: 'OTP reset password berhasil dikirim',
  })
  async forgotPassword(@CurrentUser('id') id: string) {
    const data = await this.authService.forgotPassword(id);
    return { message: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Reset password dengan OTP valid' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 201, description: 'Password berhasil direset' })
  async resetPassword(
    @CurrentUser('id') id: string,
    @Body() dto: ResetPasswordDto,
  ) {
    const data = await this.authService.resetPassword(id, dto);
    return { message: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-verification-email')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Kirim OTP verifikasi email' })
  @ApiResponse({
    status: 201,
    description: 'OTP verifikasi email berhasil dikirim',
  })
  async sendVerificationEmail(@CurrentUser('id') id: string) {
    const data = await this.authService.sendVerificationEmail(id);
    return { message: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Verifikasi email dengan OTP' })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({ status: 201, description: 'Email berhasil diverifikasi' })
  async VerifyEmail(
    @CurrentUser('id') id: string,
    @Body() dto: VerifyEmailDto,
  ) {
    const data = await this.authService.VerifyEmail(id, dto);
    return { message: data };
  }
}
