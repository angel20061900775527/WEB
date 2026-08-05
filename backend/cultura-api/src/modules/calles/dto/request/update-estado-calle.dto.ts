import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { EstadoCalle } from '../../enums/estado-calle.enum';

export class UpdateEstadoCalleDto {
  @ApiProperty({
    enum: EstadoCalle,
    example: EstadoCalle.PUBLICADO,
    description: 'Nuevo estado de la calle.',
  })
  @IsEnum(EstadoCalle, {
    message: 'El estado debe ser BORRADOR, PUBLICADO o INACTIVO.',
  })
  declare estado: EstadoCalle;
}
