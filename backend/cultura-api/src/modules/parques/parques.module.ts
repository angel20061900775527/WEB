import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParquesPublicController } from './parques-public.controller';
import { Parque } from './entities/parque.entity';
import { ParquesController } from './parques.controller';
import { ParquesService } from './parques.service';
import { FotografiasModule } from '../fotografias/fotografias.module';
@Module({
  imports: [TypeOrmModule.forFeature([Parque]), FotografiasModule],
  controllers: [ParquesController, ParquesPublicController],
  providers: [ParquesService],
  exports: [ParquesService],
})
export class ParquesModule {}
