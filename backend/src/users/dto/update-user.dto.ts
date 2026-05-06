import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { RegisterDto } from 'src/auth/dto/register.dto';

export class UpdateUserDto extends PartialType(
  OmitType(RegisterDto, ['email', 'password'] as const),
) {
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('ID', {
    message:
      'Phone number must be a valid Indonesian phone number (e.g. +6281234567890)',
  })
  phone?: string;

  @IsOptional()
  @IsUrl(
    { require_protocol: true },
    { message: 'Avatar URL must be a valid URL' },
  )
  avatarUrl?: string;

  @IsOptional()
  @Matches(/^[a-zA-Z0-9/_-]+$/, {
    message: 'Invalid Cloudinary public ID',
  })
  avatarPublicId?: string;
}
