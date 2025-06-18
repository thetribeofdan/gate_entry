// src/house/dto/create-house.dto.ts
import { Optional } from '@nestjs/common';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateHouseDto {
  @IsOptional()
  @IsString()
  house_no: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  photo_url?: string;
}
