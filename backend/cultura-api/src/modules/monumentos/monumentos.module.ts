import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonumentosController } from './monumentos.controller';
import { Monumento } from './entities/monumento.entity';
import { MonumentosService } from './monumentos.service';
import { MonumentosPublicController } from './monumentos-public.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Monumento])],
  controllers: [MonumentosController, MonumentosPublicController],
  providers: [MonumentosService],
  exports: [MonumentosService],
})
export class MonumentosModule {}
