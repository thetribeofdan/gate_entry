// src/user/dto/create-role.dto.ts
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string; // e.g. "admin", "occupant", "gateman"
}
