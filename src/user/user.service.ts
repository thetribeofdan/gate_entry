import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RoleEntity } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { encryptPayload } from '@utils/encryption.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, phone, role_id } = createUserDto;

    // 🔁 Check if phone/email already exists
    if (phone) {
      const existingPhoneUser = await this.userRepository.findOne({
        where: { phone },
      });
      if (existingPhoneUser) {
        throw new BadRequestException('Phone number already in use');
      }
    }

    if (email) {
      const existingEmailUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingEmailUser) {
        throw new BadRequestException('Email already in use');
      }
    }

    // 🔁 Check if role exists
    const role = await this.roleRepository.findOne({ where: { id: role_id } });
    if (!role) {
      throw new NotFoundException('Invalid role_id');
    }

    // ✅ Create and save user
    const user = this.userRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      role, // Set role object (not just role_id)
    });

    return this.userRepository.save(user);
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { phone, is_active: true } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email, is_active: true } });
  }

  async findByEmailOrPhone(value: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: [
        { email: value, is_active: true },
        { phone: value, is_active: true },
      ],
      relations: ['role'],
    });
  }

  async findByHouseId(house_id: number): Promise<UserEntity[]> {
    return this.userRepository.find({ where: { house_id, is_active: true } });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({ where: { is_active: true } });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id, is_active: true } });
  }


  async updateUser(id: number, updateData: Partial<UserEntity>): Promise<UserEntity> {
    await this.userRepository.update(id, updateData);

    return this.userRepository.findOneBy({ id });
  }

  async deactivateUser(id: number): Promise<void> {
    await this.userRepository.update(id, { is_active: false });
  }

  async getAllRoles(): Promise<RoleEntity[]> {
    return this.roleRepository.find();
  }
}
