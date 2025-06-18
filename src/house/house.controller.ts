import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { HouseService } from './house.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateHouseDto } from './dto/create-house.dto';
import { ApiResponse, buildResponse } from '@utils/response.util';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UpdateHouseDto } from './dto/update-house.dto';

@Controller('house')
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Post('create')
  async createHouse(
    @Body() createHouseDto: CreateHouseDto,
  ): Promise<ApiResponse> {
    const newHouse = await this.houseService.createHouse(createHouseDto);
    return buildResponse(newHouse, 'House created successfully', true, 201);
  }

  @Get('public/:public_view_id')
  async viewHousePublicly(
    @Param('public_view_id') publicViewId: string,
  ): Promise<ApiResponse> {
    const house = await this.houseService.findByPublicViewId(publicViewId);

    if (!house) {
      return buildResponse([], 'House not found', false, 404);
    }

    return buildResponse(house, 'Public house details retrieved', true, 200);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get()
  async getAllHouses(): Promise<ApiResponse> {
    const houses = await this.houseService.findAll();
    return buildResponse(houses, 'All houses retrieved successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Put(':id')
  async updateHouse(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHouseDto,
  ): Promise<ApiResponse> {
    const updatedHouse = await this.houseService.update(id, dto);

    if(!updatedHouse) return buildResponse([], 'House not found', false, 404);

    return buildResponse(updatedHouse, 'House updated successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteHouse(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse> {
    const deletedHouse = await this.houseService.delete(id);

    if(!deletedHouse) return buildResponse([], 'House not found/Successfully Deleted', false, 404);

    return buildResponse([], 'House deleted successfully');
  }
}
