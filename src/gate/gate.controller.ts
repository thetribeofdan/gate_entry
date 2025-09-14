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
import { buildResponse } from '@utils/response.util';


@ApiTags('Visitors')
@ApiBearerAuth()
@Controller('visitors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GateController {
  constructor(private readonly gateService: GateService) {}

  // Occupant initiated visitor registration
  @Roles('occupant')
  @Post('occupant')
  async createFromOccupant(@Body() dto: CreateVisitorEntryDto, @Req() req) {
    const response = await this.gateService.createFromOccupant(
      dto,
      req.user.id,
    );

    return buildResponse(
      response,
      'Visitor entry created successfully',
      true,
      201,
    );
  }

  // Gateman initiated visitor registration
  @Roles('gateman')
  @Post('gateman')
  async createFromGateman(@Body() dto: CreateVisitorEntryDto, @Req() req) {
    const response = await this.gateService.createFromGateman(dto, req.user.id);

    return buildResponse(
      response,
      'Visitor entry created successfully',
      true,
      201,
    );
  }

  // Approve visitor (occupant)
  @Roles('occupant')
  @Patch('approve')
  async approveEntry(@Query('id', ParseIntPipe) id: number, @Req() req) {
    const response = await this.gateService.approveEntry(id, req.user.id);

    return buildResponse(
      response,
      'Visitor entry approved successfully',
      true,
      200,
    );
  }

  // Reject visitor (occupant)
  @Roles('occupant')
  @Patch('reject')
  async rejectEntry(@Query('id', ParseIntPipe) id: number, @Req() req) {
    const response = await this.gateService.rejectEntry(id, req.user.id);

    return buildResponse(
      response,
      'Visitor entry rejected successfully',
      true,
      200,
    );
  }

  // Mark visitor as entered (gateman)
  @Roles('gateman')
  @Patch('mark-entered')
  async markAsEntered(@Query('id', ParseIntPipe) id: number, @Req() req) {
    const response = await this.gateService.markAsEntered(id, req.user.id);

    return buildResponse(response, 'Visitor marked as entered', true, 200);
  }

  // Scan QR code
  @Roles('gateman')
  @Post('scan')
  async scanQrCode(@Body('token') token: string) {
    const response = await this.gateService.scanQrCode(token);
    return buildResponse(response, 'QR Code scanned successfully', true, 200);
  }

  // Get all visitors (with filters)
  @Get()
  async findAll(
    @Query('approval_status') approvalStatus?: ApprovalStatus,
    @Query('onlyValid') onlyValid?: string,
    @Query('status') status?: VisitorStatus,
  ) {
    const filters = {
      approval_status: approvalStatus,
      onlyValid: onlyValid === 'true',
      status: status,
    };
    const response = await this.gateService.findAll(filters);

    return buildResponse(
      response,
      'Visitor entries fetched successfully',
      true,
      200,
    );
  }
}
