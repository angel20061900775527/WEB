import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { EstadoPlaza } from '../../enums/estado-plaza.enum';

export class UpdateEstadoPlazaDto {
  @ApiProperty({
    enum: EstadoPlaza,
    example: EstadoPlaza.PUBLICADO,
    description: 'Nuevo estado de la plaza.',
  })
  @IsEnum(EstadoPlaza, {
    message: 'El estado debe ser BORRADOR, PUBLICADO o INACTIVO.',
  })
  declare estado: EstadoPlaza;
}
