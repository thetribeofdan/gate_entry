// src/gate/dto/create-visitor-entry.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsBoolean,
  IsNumber,
  isNotEmpty,
  isNumber,
  IsDate,
  ValidationOptions,
} from 'class-validator';
import { EntryType, TransportType } from '../entities/visitor-entry.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Req } from '@nestjs/common';

export class CreateVisitorEntryDto {
  // @IsOptional()
  // @ApiProperty({example: 'waitlist', required: true, description: 'Entry Type: waitlist, unexpected'})
  // @IsEnum(EntryType)
  // entry_type: EntryType;

  @ApiProperty({
    example: 'foot',
    required: false,
    description: 'Transport Type: foot, car, motorcycle',
  })
  @IsOptional()
  @IsEnum(TransportType)
  transport_type?: TransportType;

  @ApiProperty({
    example: 'John Doe',
    required: true,
    description: 'Visitor Name',
  })
  @IsNotEmpty()
  @IsString()
  person_name: string;

  @ApiProperty({
    example: 'male',
    required: true,
    description: 'Visitor Gender',
  })
  @IsNotEmpty()
  @IsString()
  person_gender: string;

  @ApiProperty({
    example: '8024305894',
    required: false,
    description: 'Visitor Phone Number',
  })
  @IsOptional()
  @IsPhoneNumber()
  person_phone?: string;

  @ApiProperty({
    example: '6dHdD@example.com',
    required: false,
    description: 'Visitor Email',
  })
  @IsOptional()
  @IsString()
  person_email?: string;

  @ApiProperty({
    example: 'Toyota',
    required: false,
    description: 'Visitor Car Name',
  })
  @IsOptional()
  @IsString()
  car_name_brand?: string;

  @ApiProperty({
    example: 'SUV',
    required: false,
    description: 'Visitor Car Brand Type',
  })
  @IsOptional()
  @IsString()
  car_brand_type?: string;

  @ApiProperty({
    example: '2022',
    required: false,
    description: 'Visitor Car Year or Version',
  })
  @IsOptional()
  @IsString()
  car_year_or_version?: string;

  @ApiProperty({
    example: 'Red',
    required: false,
    description: 'Visitor Car Color',
  })
  @IsOptional()
  @IsString()
  car_color?: string;

  @ApiProperty({
    example: 'true',
    required: false,
    description: 'Visitor Car Tinted',
  })
  @IsOptional()
  @IsBoolean()
  is_tinted?: boolean;

  @ApiProperty({
    example: 'ABC123',
    required: false,
    description: 'Visitor Car Plate Number',
  })
  @IsOptional()
  @IsString()
  car_plate_number?: string;

  @ApiProperty({
    example: '1',
    required: false,
    description: 'The House Occupant ID',
  })
  @IsOptional()
  @IsNumber()
  occupant_id?: number;

  @ApiProperty({ example: '1', required: true, description: 'House ID' })
  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  house_id: number;

  @ApiProperty({
    example: '1',
    required: true,
    description: 'The ID of the User that Created This Visitor Entry',
  })
  @IsOptional()
  @IsNumber()
  created_by: number;

  @ApiProperty({
    example: '1',
    required: false,
    description:
      'The House Occupant that Allowed/Authorized This Visitor Entry',
  })
  @IsOptional()
  @IsNumber()
  allowed_by?: number;

  @ApiProperty({
    example: '2022-01-01',
    required: false,
    description:
      'The Date When This Visitor Entry is Allowed/Authorized to Enter',
  })
  @IsOptional()
  @IsDate()
  valid_until?: Date;
}
