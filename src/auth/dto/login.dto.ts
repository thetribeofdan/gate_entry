import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  identifier: string; // phone or email

  @IsString()
  @MinLength(6)
  password: string;
}
