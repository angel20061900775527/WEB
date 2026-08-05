import { PartialType } from '@nestjs/swagger';

import { CreateMonumentoDto } from './create-monumento.dto';

export class UpdateMonumentoDto extends PartialType(CreateMonumentoDto) {}
