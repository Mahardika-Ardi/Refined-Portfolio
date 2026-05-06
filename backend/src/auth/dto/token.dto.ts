import { IsEnum, IsNotEmpty } from 'class-validator';
import { OtpType } from 'generated/prisma/enums';

export class OtpDto {
  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(OtpType, {
    message: `Otp type must be one of the following values: ${Object.values(OtpType).join(', ')}`,
  })
  type!: OtpType;
}
