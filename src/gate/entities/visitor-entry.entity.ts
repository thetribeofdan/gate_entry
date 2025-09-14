// src/gate/entities/visitor-entry.entity.ts;
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { HouseEntity } from 'src/house/entities/house.entity';

export enum EntryType {
  WAITLIST = 'waitlist',
  UNEXPECTED = 'unexpected',
}

export enum TransportType {
  FOOT = 'foot',
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
}

export enum VisitorStatus {
  PENDING = 'pending',
  ALLOWED = 'allowed',
  DENIED = 'denied',
  EXPIRED = 'expired',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('visitor_entries')
export class VisitorEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: EntryType })
  entry_type: EntryType;

  @Column({ type: 'enum', enum: TransportType })
  transport_type: TransportType;

  @Column()
  person_name: string;

  @Column()
  person_gender: string;

  @Column({ nullable: true })
  person_phone: string;

  @Column({ nullable: true })
  person_email: string;

  @Column({ nullable: true })
  car_name_brand: string;

  @Column({ nullable: true })
  car_brand_type: string;

  @Column({ nullable: true })
  car_year_or_version: string;

  @Column({ nullable: true })
  car_color: string;

  @Column({ nullable: true })
  is_tinted?: boolean;

  @Column({ nullable: true })
  car_plate_number: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'occupant_id' })
  occupant?: UserEntity;

  @ManyToOne(() => HouseEntity)
  @JoinColumn({ name: 'house_id' })
  house: HouseEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by' })
  created_by?: UserEntity;

  @Column({ type: 'enum', enum: VisitorStatus, default: VisitorStatus.PENDING })
  status: VisitorStatus;

  @Column({ type: 'timestamp', nullable: true })
  allowed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  valid_until: Date;

  // In VisitorEntryEntity
  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  approval_status: ApprovalStatus;

  @Column({ type: 'timestamp', nullable: true })
  approved_at: Date;

  @Column({ type: 'text', nullable: true })
  qr_code: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approved_by?: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'allowed_by' })
  allowed_by?: UserEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
