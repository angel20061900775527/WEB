import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Rio } from './entities/rio.entity';
import { RiosController } from './rios.controller';
import { RiosService } from './rios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rio])],
  controllers: [RiosController],
  providers: [RiosService],
  exports: [RiosService],
})
export class RiosModule {}
