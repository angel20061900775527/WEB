import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { EstadoMonumento } from '../../enums/estado-monumento.enum';

export class UpdateEstadoMonumentoDto {
  @ApiProperty({
    enum: EstadoMonumento,
    example: EstadoMonumento.PUBLICADO,
    description: 'Nuevo estado del monumento.',
  })
  @IsEnum(EstadoMonumento, {
    message: 'El estado debe ser BORRADOR, PUBLICADO o INACTIVO.',
  })
  declare estado: EstadoMonumento;
}
