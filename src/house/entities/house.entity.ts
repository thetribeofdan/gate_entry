// src/house/entities/house.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('houses')
export class HouseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  house_no?: string;

  @Column()
  address: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 6 })
  longitude?: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 6 })
  latitude?: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  photo_url?: string;

  @Column({ unique: true })
  public_view_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => UserEntity, (user) => user.house)
  users: UserEntity[];
}
