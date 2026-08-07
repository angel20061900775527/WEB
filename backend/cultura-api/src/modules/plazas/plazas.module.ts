import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plaza } from './entities/plaza.entity';
import { PlazasController } from './plazas.controller';
import { PlazasService } from './plazas.service'
@Module({
  imports: [TypeOrmModule.forFeature([Plaza])],
  controllers: [PlazasController],
  providers: [PlazasService],
  exports: [PlazasService],
})
export class PlazasModule {}
