import {
  IsString,
  IsEmail,
  IsOptional,
  IsStrongPassword,
  IsPhoneNumber,
  IsNotEmpty,
} from 'class-validator';

export class LogInDto {
  @IsNotEmpty()
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @IsNotEmpty()
  @IsString({ message: 'Password must be a string' })
  @IsStrongPassword(
    {},
    {
      message:
        'Password must be at least 8 characters and contain uppercase letters, numbers, and symbols',
    },
  )
  password!: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('ID', {
    message:
      'Phone number must be a valid Indonesian phone number (e.g. +6281234567890)',
  })
  phone?: string;
}
