import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

import { BasePatrimonialDto } from '../../../../common/dto/request/base-patrimonial.dto';

export class CreateAuditorioDto extends BasePatrimonialDto {
  @ApiPropertyOptional({
    example: 'Lunes a viernes de 08:00 a 17:00',
    description: 'Horario de atención del auditorio.',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({
    message: 'El horario de atención debe ser una cadena de texto.',
  })
  @MaxLength(255, {
    message: 'El horario de atención no puede superar los 255 caracteres.',
  })
  declare horarioAtencion?: string;

  @ApiPropertyOptional({
    example: 'Dirección de Cultura del GADM Zamora',
    description: 'Persona o unidad responsable del auditorio.',
    maxLength: 150,
  })
  @IsOptional()
  @IsString({
    message: 'El responsable debe ser una cadena de texto.',
  })
  @MaxLength(150, {
    message: 'El responsable no puede superar los 150 caracteres.',
  })
  declare responsable?: string;

  @ApiPropertyOptional({
    example: 'https://www.zamora.gob.ec',
    description: 'Sitio web relacionado con el auditorio.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({
    message: 'El sitio web debe ser una cadena de texto.',
  })
  @IsUrl(
    {
      require_protocol: true,
    },
    {
      message:
        'El sitio web debe ser una URL válida e incluir http:// o https://.',
    },
  )
  @MaxLength(500, {
    message: 'El sitio web no puede superar los 500 caracteres.',
  })
  declare sitioWeb?: string;
}
