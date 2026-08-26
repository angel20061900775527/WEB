import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FotografiasModule } from '../fotografias/fotografias.module';

import { Rio } from './entities/rio.entity';
import { RiosController } from './rios.controller';
import { RiosPublicController } from './rios-public.controller';
import { RiosService } from './rios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rio]), FotografiasModule],
  controllers: [RiosController, RiosPublicController],
  providers: [RiosService],
  exports: [RiosService],
})
export class RiosModule {}
