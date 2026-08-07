import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { EstadoRio } from '../../enums/estado-rio.enum';

export class UpdateEstadoRioDto {
  @ApiProperty({
    enum: EstadoRio,
    example: EstadoRio.PUBLICADO,
    description: 'Nuevo estado del río.',
  })
  @IsEnum(EstadoRio, {
    message: 'El estado debe ser BORRADOR, PUBLICADO o INACTIVO.',
  })
  declare estado: EstadoRio;
}
