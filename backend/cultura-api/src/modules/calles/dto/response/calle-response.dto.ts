import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Calle } from '../../entities/calle.entity';
import { EstadoCalle } from '../../enums/estado-calle.enum';

export class CalleResponseDto {
  @ApiProperty({ example: '1' })
  declare id: number;

  @ApiProperty({ example: 'Calle Sevilla de Oro' })
  declare nombre: string;

  @ApiProperty({
    example:
      'Vía urbana ubicada en el centro de la ciudad de Zamora, reconocida por su importancia histórica.',
  })
  declare descripcion: string;

  @ApiPropertyOptional({
    example:
      'La calle recibió su nombre en reconocimiento a la antigua denominación histórica de la ciudad.',
    nullable: true,
  })
  declare resenaHistorica: string | null;

  @ApiPropertyOptional({
    example: '1985-05-20',
    nullable: true,
  })
  declare fechaDenominacion: string | null;

  @ApiProperty({
    enum: EstadoCalle,
    example: EstadoCalle.BORRADOR,
  })
  declare estado: EstadoCalle;

  @ApiProperty({
    example: 'Centro urbano de Zamora',
  })
  declare ubicacion: string;

  @ApiPropertyOptional({
    example: 'Barrio Central',
    nullable: true,
  })
  declare sector: string | null;

  @ApiPropertyOptional({
    example: -4.0697,
    nullable: true,
  })
  declare latitud: number | null;

  @ApiPropertyOptional({
    example: -78.9567,
    nullable: true,
  })
  declare longitud: number | null;

  @ApiPropertyOptional({
    example:
      'Archivo Histórico del GADM Zamora; ordenanzas municipales; entrevistas a moradores del sector.',
    nullable: true,
  })
  declare fuentesInformacion: string | null;

  @ApiPropertyOptional({
    example:
      'La fecha de denominación está pendiente de confirmación documental.',
    nullable: true,
  })
  declare observaciones: string | null;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
  })
  declare fotografiaPrincipalId: string | null;

  @ApiProperty({
    example: '2026-08-05T14:30:00.000Z',
  })
  declare fechaRegistro: Date;

  @ApiProperty({
    example: '2026-08-05T14:30:00.000Z',
  })
  declare fechaModificacion: Date;

  static fromEntity(calle: Calle): CalleResponseDto {
    return {
      id: calle.id,
      nombre: calle.nombre,
      descripcion: calle.descripcion,
      resenaHistorica: calle.resenaHistorica,
      fechaDenominacion: calle.fechaDenominacion,
      estado: calle.estado,
      ubicacion: calle.ubicacion,
      sector: calle.sector,
      latitud: calle.latitud,
      longitud: calle.longitud,
      fuentesInformacion: calle.fuentesInformacion,
      observaciones: calle.observaciones,
      fotografiaPrincipalId: calle.fotografiaPrincipalId,
      fechaRegistro: calle.fechaRegistro,
      fechaModificacion: calle.fechaModificacion,
    };
  }
}
