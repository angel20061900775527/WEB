import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiosPublicController } from './rios-public.controller';
import { Rio } from './entities/rio.entity';
import { RiosController } from './rios.controller';
import { RiosService } from './rios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rio])],
  controllers: [RiosController, RiosPublicController],
  providers: [RiosService],
  exports: [RiosService],
})
export class RiosModule {}
