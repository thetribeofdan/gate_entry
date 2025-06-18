// src/gate/dto/update-visitor-entry.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateVisitorEntryDto } from './create-visitor-entry.dto';
import { IsEnum, IsOptional, IsDateString, IsNumber } from 'class-validator';
import {
  ApprovalStatus,
  VisitorStatus,
} from '../entities/visitor-entry.entity';

export class UpdateVisitorEntryDto extends PartialType(CreateVisitorEntryDto) {
  @IsOptional()
  @IsEnum(ApprovalStatus)
  approval_status?: ApprovalStatus;

  @IsOptional()
  @IsEnum(VisitorStatus)
  status?: VisitorStatus;

  @IsOptional()
  @IsDateString()
  approved_at?: string;

  @IsOptional()
  @IsNumber()
  approved_by_id?: number;

  @IsOptional()
  @IsDateString()
  allowed_at?: string;

  @IsOptional()
  @IsNumber()
  allowed_by?: number;
}
