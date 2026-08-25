import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FotografiasModule } from '../fotografias/fotografias.module';

import { CallesPublicController } from './calles-public.controller';
import { CallesController } from './calles.controller';
import { CallesService } from './calles.service';
import { Calle } from './entities/calle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calle]), FotografiasModule],
  controllers: [CallesController, CallesPublicController],
  providers: [CallesService],
  exports: [CallesService],
})
export class CallesModule {}
