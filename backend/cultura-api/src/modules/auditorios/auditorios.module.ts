import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FotografiasModule } from '../fotografias/fotografias.module';

import { AuditoriosController } from './auditorios.controller';
import { AuditoriosPublicController } from './auditorios-public.controller';
import { AuditoriosService } from './auditorios.service';
import { Auditorio } from './entities/auditorio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auditorio]), FotografiasModule],
  controllers: [AuditoriosController, AuditoriosPublicController],
  providers: [AuditoriosService],
  exports: [AuditoriosService],
})
export class AuditoriosModule {}
