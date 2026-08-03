import { PartialType } from '@nestjs/swagger';

import { CreateParqueDto } from './create-parque.dto';

export class UpdateParqueDto extends PartialType(CreateParqueDto) {}
