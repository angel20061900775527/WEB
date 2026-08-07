import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { EstadoAuditorio } from '../../enums/estado-auditorio.enum';

export class UpdateEstadoAuditorioDto {
  @ApiProperty({
    enum: EstadoAuditorio,
    example: EstadoAuditorio.PUBLICADO,
    description: 'Nuevo estado del auditorio.',
  })
  @IsEnum(EstadoAuditorio, {
    message: 'El estado debe ser BORRADOR, PUBLICADO o INACTIVO.',
  })
  declare estado: EstadoAuditorio;
}
