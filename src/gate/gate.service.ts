// src/gate/gate.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import {
  VisitorEntryEntity,
  ApprovalStatus,
  EntryType,
  TransportType,
  VisitorStatus,
} from './entities/visitor-entry.entity';
import { CreateVisitorEntryDto } from './dto/create-visitor-entry.dto';
import { UpdateVisitorEntryDto } from './dto/update-visitor-entry.dto';

@Injectable()
export class GateService {
  constructor(
    @InjectRepository(VisitorEntryEntity)
    private readonly entryRepo: Repository<VisitorEntryEntity>,
  ) {}

  async createFromOccupant(
    dto: CreateVisitorEntryDto,
    occupantId: number,
    houseId: number,
  ) {
    const entry = this.entryRepo.create({
      ...dto,
      occupant: { id: occupantId },
      house: { id: houseId },
      entry_type: EntryType.WAITLIST,
      approval_status: ApprovalStatus.PENDING,
    });
    return await this.entryRepo.save(entry);
  }

  async createFromGateman(dto: CreateVisitorEntryDto, gatemanId: number) {
    const entry = this.entryRepo.create({
      ...dto,
      entry_type: EntryType.UNEXPECTED,
      approval_status: ApprovalStatus.PENDING,
    });
    return await this.entryRepo.save(entry);
  }

  async approveEntry(entryId: number, approverId: number) {
    const entry = await this.entryRepo.findOne({
      where: { id: entryId },
      relations: ['occupant', 'house'],
    });
    if (!entry) throw new NotFoundException('Entry not found');

    entry.approval_status = ApprovalStatus.APPROVED;
    entry.approved_by = { id: approverId } as any;
    entry.approved_at = new Date();
    return await this.entryRepo.save(entry);
  }

  async rejectEntry(entryId: number, approverId: number) {
    const entry = await this.entryRepo.findOne({
      where: { id: entryId },
      relations: ['occupant', 'house'],
    });
    if (!entry) throw new NotFoundException('Entry not found');

    entry.approval_status = ApprovalStatus.REJECTED;
    entry.approved_by = { id: approverId } as any;
    entry.approved_at = new Date();
    return await this.entryRepo.save(entry);
  }

  async markAsEntered(entryId: number, gatemanId: number) {
    const entry = await this.entryRepo.findOneBy({ id: entryId });
    if (!entry) throw new NotFoundException('Entry not found');
    if (entry.approval_status !== ApprovalStatus.APPROVED)
      throw new ForbiddenException('Entry is not yet approved');

    entry.status = VisitorStatus.ALLOWED;
    entry.allowed_by = { id: gatemanId } as any;
    entry.allowed_at = new Date();
    return await this.entryRepo.save(entry);
  }

  async findAll() {
    return await this.entryRepo.find({
      relations: ['occupant', 'house', 'approved_by', 'marked_by'],
      order: { created_at: 'DESC' },
    });
  }

  async search(query: string) {
    return await this.entryRepo.find({
      where: [
        { person_name: ILike(`%${query}%`) },
        { car_plate_number: ILike(`%${query}%`) },
      ],
      relations: ['occupant', 'house'],
    });
  }
}
