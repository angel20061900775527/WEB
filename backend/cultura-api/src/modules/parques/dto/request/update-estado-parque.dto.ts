import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { EstadoParque } from '../../enums/estado-parque.enum';

export class UpdateEstadoParqueDto {
  @ApiProperty({
    enum: EstadoParque,
    example: EstadoParque.PUBLICADO,
    description: 'Nuevo estado del parque',
  })
  @IsEnum(EstadoParque, {
    message: 'El estado debe ser BORRADOR, PUBLICADO o INACTIVO.',
  })
  declare estado: EstadoParque;
}
