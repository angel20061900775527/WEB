import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParquesPublicController } from './parques-public.controller';
import { Parque } from './entities/parque.entity';
import { ParquesController } from './parques.controller';
import { ParquesService } from './parques.service';

@Module({
  imports: [TypeOrmModule.forFeature([Parque])],
  controllers: [ParquesController, ParquesPublicController],
  providers: [ParquesService],
  exports: [ParquesService],
})
export class ParquesModule {}
