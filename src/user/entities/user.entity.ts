// src/user/entities/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { HouseEntity } from 'src/house/entities/house.entity';
// import { create } from 'domain';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  phone?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column()
  password: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => HouseEntity, (house) => house.users, { nullable: true })
  @JoinColumn({ name: 'house_id' })
  house: HouseEntity;

  @Column({ nullable: true })
  house_id?: number; // FK to a future `House` entity

  @ManyToOne(() => RoleEntity, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Column()
  role_id: number;

  @Column({ default: false })
  onboarded: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
