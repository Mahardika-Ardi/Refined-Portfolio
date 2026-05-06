import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'OTP code is required' })
  @IsString()
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  code!: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @IsStrongPassword(
    {},
    {
      message:
        'Password must be at least 8 characters and contain uppercase letters, numbers, and symbols',
    },
  )
  password!: string;
}
