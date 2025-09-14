// src/gate/gate.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, MoreThanOrEqual, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  VisitorEntryEntity,
  ApprovalStatus,
  EntryType,
  TransportType,
  VisitorStatus,
} from './entities/visitor-entry.entity';
import { CreateVisitorEntryDto } from './dto/create-visitor-entry.dto';
import { UpdateVisitorEntryDto } from './dto/update-visitor-entry.dto';
import { decryptPayload, encryptPayload } from '@utils/encryption.util';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class GateService {
  constructor(
    @InjectRepository(VisitorEntryEntity)
    private readonly entryRepo: Repository<VisitorEntryEntity>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}

  async createFromOccupant(
    dto: CreateVisitorEntryDto,
    occupantId: number,
  ) {
    // 1️⃣ Validate bare minimum required fields
    if (!dto.person_name || !dto.person_gender) {
      throw new BadRequestException(
        'Person name and gender are required to register a visitor',
      );
    }

    const occupant = await this.userEntity.findOne({
      where: { id: occupantId, is_active: true},
    });

    if (!occupant) {
      throw new NotFoundException('Occupant not Activated/Authorized');
    }

    // 2️⃣ Create entry (approval by Occupant is automatic)
    const entry = this.entryRepo.create({
      person_name: dto.person_name,
      person_gender: dto.person_gender,
      occupant: { id: occupantId },
      house: { id: occupant.house_id },
      entry_type: EntryType.WAITLIST,
      approved_at: new Date(),
      approved_by: { id: occupantId },
      approval_status: ApprovalStatus.APPROVED,
      created_by: { id: occupantId },
      valid_until: dto.valid_until
        ? new Date(dto.valid_until)
        : new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const savedEntry = await this.entryRepo.save(entry);

    // TODO:include an a flow to send an email to the visitor if the email field is filled

    // 3️⃣ Prepare payload for encryption (only necessary details)
    const payload = {
      id: savedEntry.id,
      person_name: savedEntry.person_name,
      person_gender: savedEntry.person_gender,
      house_id: occupant.house_id,
      created_at: savedEntry.created_at,
    };

    // 4️⃣ Encrypt payload for QR code
    const encryptedToken = encryptPayload(payload);

    // 5️⃣ Store QR code token
    savedEntry.qr_code = encryptedToken;
    await this.entryRepo.save(savedEntry);

    return savedEntry.qr_code;
  }

  async createFromGateman(dto: CreateVisitorEntryDto, gatemanId: number) {
    if (!dto.person_name || !dto.person_gender) {
      throw new BadRequestException(
        'Person name and gender are required to register a visitor',
      );
    }

    if( !dto.house_id){
      throw new BadRequestException(
        'House ID is required to register a visitor from gateman',
      );
    }

    const entry = this.entryRepo.create({
      person_name: dto.person_name,
      person_gender: dto.person_gender,
      house: { id: dto.house_id },
      entry_type: EntryType.UNEXPECTED,
      approval_status: ApprovalStatus.PENDING,
      created_by: { id: gatemanId },
      valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const savedEntry = await this.entryRepo.save(entry);

    const payload = {
      id: savedEntry.id,
      person_name: savedEntry.person_name,
      person_gender: savedEntry.person_gender,
      house_id: dto.house_id,
      created_at: savedEntry.created_at,
    };

    //TODO: some sort of notification to the occupants of the houses on the app.....maybe firebase or email

    const encryptedToken = encryptPayload(payload);
    savedEntry.qr_code = encryptedToken;

    await this.entryRepo.save(savedEntry);

    return savedEntry.qr_code;
  }

  async approveEntry(entryId: number, approverId: number) {
    const entry = await this.entryRepo.findOne({
      where: { id: entryId },
      relations: ['occupant', 'house'],
    });
    if (!entry) throw new NotFoundException('Entry not found');

    const approver = await this.userEntity.findOne({
      where: { id: approverId, is_active: true, house: { id: entry.house.id } },
    });

    if (!approver)
      throw new NotFoundException(
        'Approver not Allocated to Visitors Destination House/Inactive',
      );

    if (!entry.occupant?.id) {
      entry.occupant = { id: approverId } as any;
    }

    entry.approval_status = ApprovalStatus.APPROVED;
    entry.approved_by = { id: approverId } as any;
    entry.approved_at = new Date();
    // entry.occupant = { id: approverId } as any;

    return await this.entryRepo.save(entry);
  }

  async rejectEntry(entryId: number, approverId: number) {
    const entry = await this.entryRepo.findOne({
      where: { id: entryId },
      relations: ['house'],
    });

    if (!entry) throw new NotFoundException('Entry not found');

    const approver = await this.userEntity.findOne({
      where: { id: approverId, is_active: true, house: { id: entry.house.id } },
    });

    if (!approver)
      throw new NotFoundException(
        'Approver not Allocated to Visitors Destination House/Inactive',
      );

    entry.approval_status = ApprovalStatus.REJECTED;
    entry.approved_by = { id: approverId } as any;
    entry.approved_at = new Date();
    entry.occupant = { id: approverId } as any;
    entry.status = VisitorStatus.DENIED;

    return await this.entryRepo.save(entry);
  }

  async markAsEntered(entryId: number, gatemanId: number) {
    const entry = await this.entryRepo.findOneBy({ id: entryId });

    if (!entry) throw new NotFoundException('Entry not found');

    if (entry.approval_status !== ApprovalStatus.APPROVED)
      throw new ForbiddenException('Entry is not yet approved');

    if (entry.status !== VisitorStatus.PENDING)
      throw new ForbiddenException(
        'Entry is already marked as entered...DO Not Allow Double Entry',
      );

    // CHECKS IF ENTRY DATE AS PASSED
    if (entry.valid_until && entry.valid_until < new Date()) {
      entry.status = VisitorStatus.EXPIRED;

      await this.entryRepo.save(entry);

      throw new ForbiddenException(
        'Entry is expired...Visitor did not Come in Time',
      );
    }

    entry.status = VisitorStatus.ALLOWED;
    entry.allowed_by = { id: gatemanId } as any;
    entry.allowed_at = new Date();

    return await this.entryRepo.save(entry);
  }

  async scanQrCode(token: string) {
    try {
      const payload = decryptPayload(token);
      const entry = await this.entryRepo.findOne({
        where: { id: payload.id },
        relations: ['occupant', 'house', 'approved_by'],
      });

      if (!entry) {
        throw new NotFoundException('Visitor Record not found');
      }

      if (entry.valid_until && entry.valid_until < new Date()) {
        if (entry.status !== VisitorStatus.EXPIRED) {
          entry.status = VisitorStatus.EXPIRED;
          await this.entryRepo.save(entry);
        }
        throw new ForbiddenException(
          'Entry is expired...Visitor did not Come in Time',
        );
      }

      return {
        id: entry.id,
        person_name: entry.person_name,
        person_gender: entry.person_gender,
        house: entry.house,
        approval_status: entry.approval_status,
        status: entry.status,
        created_at: entry.created_at,
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Invalid or corrupted QR code');
    }
  }

  async findAll(filters?: {
    approval_status?: ApprovalStatus;
    onlyValid?: boolean;
    status?: VisitorStatus;
  }) {
    const where: any = {};

    if (filters?.approval_status) {
      where.approval_status = filters.approval_status;
    }

    if (filters?.onlyValid) {
      where.valid_until = MoreThanOrEqual(new Date());
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return await this.entryRepo.find({
      where,
      relations: ['occupant', 'house', 'approved_by'],
      order: { created_at: 'DESC' },
    });
  }

  async search(query: string) {
    return await this.entryRepo.find({
      where: [
        { person_name: ILike(`%${query}%`) },
        { house: ILike(`%${query}%`) },
      ],
      relations: ['occupant', 'house'],
    });
  }

  async cleanupExpiredWaitlist() {
    const expiredEntries = await this.entryRepo.find({
      where: [
        { status: VisitorStatus.PENDING, valid_until: LessThan(new Date()) },
        { status: VisitorStatus.ALLOWED, valid_until: LessThan(new Date()) },
      ],
    });

    if (expiredEntries.length > 0) {
      for (const entry of expiredEntries) {
        entry.status = VisitorStatus.EXPIRED;
        // entry.approval_status = ApprovalStatus.REJECTED; // Optional: force reject
      }
      await this.entryRepo.save(expiredEntries);
    }

    return { cleaned: expiredEntries.length };
  }



  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanupCron() {
    const result = await this.cleanupExpiredWaitlist();
    console.log(`[Cleanup Job] Expired waitlist entries cleaned: ${result.cleaned}`);
  }

}
