import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HouseEntity } from './entities/house.entity';
import { CreateHouseDto } from './dto/create-house.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateHouseDto } from './dto/update-house.dto';

@Injectable()
export class HouseService {
  constructor(
    @InjectRepository(HouseEntity)
    private readonly houseRepository: Repository<HouseEntity>,
  ) {}

  async createHouse(CreateHouseDto: CreateHouseDto): Promise<HouseEntity> {
    const house = this.houseRepository.create({
      ...CreateHouseDto,
      public_view_id: uuidv4(),
    });
    return this.houseRepository.save(house);
  }

  async findByPublicViewId(publicViewId: string): Promise<HouseEntity | null> {
    return this.houseRepository.findOne({
      where: { public_view_id: publicViewId },
    });
  }

  async findAll(): Promise<HouseEntity[]> {
    return this.houseRepository.find({ relations: ['users'] });
  }

  async update(
    id: number,
    UpdateHouseDto: UpdateHouseDto,
  ): Promise<HouseEntity | boolean> {
    const house = await this.houseRepository.preload({
      id,
      ...UpdateHouseDto,
    });

    if (!house) return false;

    return this.houseRepository.save(house);
  }

  async delete(id: number): Promise<void|boolean> {
    const result = await this.houseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('House not found');
    }
    return true
  }
}
