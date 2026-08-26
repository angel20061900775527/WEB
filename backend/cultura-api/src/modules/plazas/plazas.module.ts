import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FotografiasModule } from '../fotografias/fotografias.module';

import { Plaza } from './entities/plaza.entity';
import { PlazasController } from './plazas.controller';
import { PlazasPublicController } from './plazas-public.controller';
import { PlazasService } from './plazas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plaza]), FotografiasModule],
  controllers: [PlazasController, PlazasPublicController],
  providers: [PlazasService],
  exports: [PlazasService],
})
export class PlazasModule {}
