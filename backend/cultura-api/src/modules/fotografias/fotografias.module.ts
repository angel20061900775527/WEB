import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FotografiasPublicController } from './fotografias-public.controller';
import { Auditorio } from '../auditorios/entities/auditorio.entity';
import { Calle } from '../calles/entities/calle.entity';
import { Monumento } from '../monumentos/entities/monumento.entity';
import { Museo } from '../museos/entities/museo.entity';
import { Parque } from '../parques/entities/parque.entity';
import { Plaza } from '../plazas/entities/plaza.entity';
import { Rio } from '../rios/entities/rio.entity';

import { Fotografia } from './entities/fotografia.entity';
import { FotografiasController } from './fotografias.controller';
import { FotografiasService } from './fotografias.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Fotografia,
      Parque,
      Calle,
      Monumento,
      Rio,
      Plaza,
      Museo,
      Auditorio,
    ]),
  ],
  controllers: [FotografiasController, FotografiasPublicController],
  providers: [FotografiasService],
  exports: [TypeOrmModule, FotografiasService],
})
export class FotografiasModule {}
