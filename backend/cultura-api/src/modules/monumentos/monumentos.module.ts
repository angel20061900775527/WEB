import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FotografiasModule } from '../fotografias/fotografias.module';

import { MonumentosController } from './monumentos.controller';
import { MonumentosPublicController } from './monumentos-public.controller';
import { MonumentosService } from './monumentos.service';
import { Monumento } from './entities/monumento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Monumento]), FotografiasModule],
  controllers: [MonumentosController, MonumentosPublicController],
  providers: [MonumentosService],
  exports: [MonumentosService],
})
export class MonumentosModule {}
