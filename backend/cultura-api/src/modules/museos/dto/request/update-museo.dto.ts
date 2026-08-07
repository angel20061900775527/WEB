import { PartialType } from '@nestjs/swagger';

import { CreateMuseoDto } from './create-museo.dto';

export class UpdateMuseoDto extends PartialType(CreateMuseoDto) {}
