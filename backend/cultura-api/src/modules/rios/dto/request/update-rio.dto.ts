import { PartialType } from '@nestjs/swagger';

import { CreateRioDto } from './create-rio.dto';

export class UpdateRioDto extends PartialType(CreateRioDto) {}
