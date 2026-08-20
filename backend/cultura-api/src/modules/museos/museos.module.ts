import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseosPublicController } from './museos-public.controller';
import { Museo } from './entities/museo.entity';
import { MuseosController } from './museos.controller';
import { MuseosService } from './museos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Museo])],
  controllers: [MuseosController, MuseosPublicController],
  providers: [MuseosService],
  exports: [MuseosService],
})
export class MuseosModule {}
