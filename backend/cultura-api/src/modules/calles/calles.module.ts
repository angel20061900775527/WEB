import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallesPublicController } from './calles-public.controller';
import { Calle } from './entities/calle.entity';
import { CallesService } from './calles.service';
import { CallesController } from './calles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Calle])],
  controllers: [CallesController, CallesPublicController],
  providers: [CallesService],
  exports: [CallesService],
})
export class CallesModule {}
