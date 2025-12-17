import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'USERNAME_OR_EMAIL_REQUIRED' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'PASSWORD_REQUIRED' })
  password: string;
}
