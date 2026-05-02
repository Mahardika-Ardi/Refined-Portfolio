import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsStrongPassword,
  IsDate,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Gender } from 'generated/prisma/enums';

export class RegisterDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

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

  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  firstName!: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

  @Type(() => Date)
  @IsNotEmpty({ message: 'Birth date is required' })
  @IsDate({ message: 'Birth date must be a valid date' })
  birthDate!: Date;

  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(Gender, {
    message: `Gender must be one of the following values: ${Object.values(Gender).join(', ')}`,
  })
  gender!: Gender;
}
