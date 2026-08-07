import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditoriosController } from './auditorios.controller';
import { AuditoriosService } from './auditorios.service';
import { Auditorio } from './entities/auditorio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auditorio])],
  controllers: [AuditoriosController],
  providers: [AuditoriosService],
  exports: [AuditoriosService],
})
export class AuditoriosModule {}
