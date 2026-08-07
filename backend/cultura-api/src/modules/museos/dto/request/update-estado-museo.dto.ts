import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { EstadoMuseo } from '../../enums/estado-museo.enum';

export class UpdateEstadoMuseoDto {
  @ApiProperty({
    enum: EstadoMuseo,
    example: EstadoMuseo.PUBLICADO,
    description: 'Nuevo estado del museo.',
  })
  @IsEnum(EstadoMuseo, {
    message: 'El estado debe ser BORRADOR, PUBLICADO o INACTIVO.',
  })
  declare estado: EstadoMuseo;
}
