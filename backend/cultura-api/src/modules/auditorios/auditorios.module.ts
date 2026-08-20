import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriosPublicController } from './auditorios-public.controller';
import { AuditoriosController } from './auditorios.controller';
import { AuditoriosService } from './auditorios.service';
import { Auditorio } from './entities/auditorio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auditorio])],
  controllers: [AuditoriosController, AuditoriosPublicController],
  providers: [AuditoriosService],
  exports: [AuditoriosService],
})
export class AuditoriosModule {}
