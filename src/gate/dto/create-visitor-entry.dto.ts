// src/gate/dto/create-visitor-entry.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { EntryType, TransportType } from '../entities/visitor-entry.entity';

export class CreateVisitorEntryDto {
  @IsEnum(EntryType)
  entry_type: EntryType;

  @IsEnum(TransportType)
  transport_type: TransportType;

  @IsNotEmpty()
  @IsString()
  person_name: string;

  @IsNotEmpty()
  @IsString()
  person_gender: string;

  @IsOptional()
  @IsPhoneNumber()
  person_phone?: string;

  @IsOptional()
  @IsString()
  car_name_brand?: string;

  @IsOptional()
  @IsString()
  car_brand_type?: string;

  @IsOptional()
  @IsString()
  car_year_or_version?: string;

  @IsOptional()
  @IsString()
  car_color?: string;

  @IsOptional()
  @IsBoolean()
  is_tinted?: boolean;

  @IsOptional()
  @IsString()
  car_plate_number?: string;

  @IsNotEmpty()
  @IsNumber()
  occupant_id: number;

  @IsNotEmpty()
  @IsNumber()
  house_id: number;
}
