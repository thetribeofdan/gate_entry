import { Module } from '@nestjs/common';
import { GateController } from './gate.controller';
import { GateService } from './gate.service';
import { VisitorEntryEntity } from './entities/visitor-entry.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VisitorEntryEntity, UserEntity]),
  ],
  controllers: [GateController],
  providers: [GateService]
})
export class GateModule {}
