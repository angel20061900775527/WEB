import { PartialType } from '@nestjs/swagger';

import { CreateAuditorioDto } from './create-auditorio.dto';

export class UpdateAuditorioDto extends PartialType(CreateAuditorioDto) {}
