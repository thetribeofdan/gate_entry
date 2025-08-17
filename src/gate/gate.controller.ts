import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GateService } from './gate.service';
import { CreateVisitorEntryDto } from './dto/create-visitor-entry.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApprovalStatus, VisitorStatus } from './entities/visitor-entry.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('Visitors')
@ApiBearerAuth()
@Controller('visitors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GateController {
  constructor(private readonly gateService: GateService) {}

  // Occupant initiated visitor registration
  @Roles('occupant')
  @Post('occupant')
  createFromOccupant(
    @Body() dto: CreateVisitorEntryDto,
    @Req() req
  ) {
    return this.gateService.createFromOccupant(dto, req.user.id);
  }

  // Gateman initiated visitor registration
  @Roles('gateman')
  @Post('gateman')
  createFromGateman(
    @Body() dto: CreateVisitorEntryDto,
    @Req() req
  ) {
    return this.gateService.createFromGateman(dto, req.user.id);
  }

  // Approve visitor (occupant)
  @Roles('occupant')
  @Patch('approve')
  approveEntry(
    @Query('id', ParseIntPipe) id: number,
    @Req() req
  ) {
    return this.gateService.approveEntry(id, req.user.id);
  }

  // Reject visitor (occupant)
  @Roles('occupant')
  @Patch('reject')
  rejectEntry(
    @Query('id', ParseIntPipe) id: number,
    @Req() req
  ) {
    return this.gateService.rejectEntry(id, req.user.id);
  }

  // Mark visitor as entered (gateman)
  @Roles('gateman')
  @Patch('mark-entered')
  markAsEntered(
    @Query('id', ParseIntPipe) id: number,
    @Req() req
  ) {
    return this.gateService.markAsEntered(id, req.user.id);
  }

  // Scan QR code
  @Roles('gateman')
  @Post('scan')
  scanQrCode(@Body('token') token: string) {
    return this.gateService.scanQrCode(token);
  }

  // Get all visitors (with filters)
  @Get()
  findAll(
    @Query('approval_status') approvalStatus?: ApprovalStatus,
    @Query('onlyValid') onlyValid?: string,
    @Query('status') status?: VisitorStatus,
  ) {
    const filters = {
      approval_status: approvalStatus,
      onlyValid: onlyValid === 'true',
      status: status,
    };
    return this.gateService.findAll(filters);
  }
}
