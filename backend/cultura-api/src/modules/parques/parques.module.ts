import { Module } from '@nestjs/common';
import { ParquesService } from './parques.service';
import { ParquesController } from './parques.controller';

@Module({
  providers: [ParquesService],
  controllers: [ParquesController]
})
export class ParquesModule {}
