import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Plaza } from '../../entities/plaza.entity';
import { EstadoPlaza } from '../../enums/estado-plaza.enum';

export class PlazaResponseDto {
  @ApiProperty({ example: '1' })
  declare id: number;

  @ApiProperty({
    example: 'Plaza Central de Zamora',
  })
  declare nombre: string;

  @ApiProperty({
    example:
      'Espacio público de importancia histórica y cultural para la ciudad de Zamora.',
  })
  declare descripcion: string;

  @ApiPropertyOptional({
    example:
      'La plaza ha sido escenario de actividades cívicas y culturales de la ciudad.',
    nullable: true,
  })
  declare resenaHistorica: string | null;

  @ApiPropertyOptional({
    example: '1950-08-15',
    nullable: true,
  })
  declare fechaCreacion: string | null;

  @ApiProperty({
    enum: EstadoPlaza,
    example: EstadoPlaza.BORRADOR,
  })
  declare estado: EstadoPlaza;

  @ApiProperty({
    example: 'Centro de la ciudad de Zamora',
  })
  declare ubicacion: string;

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
    example: 'Archivo Histórico del GADM Zamora; documentos institucionales.',
    nullable: true,
  })
  declare fuentesInformacion: string | null;

  @ApiPropertyOptional({
    example: 'Información pendiente de validación por la Dirección de Cultura.',
    nullable: true,
  })
  declare observaciones: string | null;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
  })
  declare fotografiaPrincipalId: string | null;

  @ApiProperty({
    example: '2026-08-07T16:00:00.000Z',
  })
  declare fechaRegistro: Date;

  @ApiProperty({
    example: '2026-08-07T16:00:00.000Z',
  })
  declare fechaModificacion: Date;

  static fromEntity(plaza: Plaza): PlazaResponseDto {
    return {
      id: plaza.id,
      nombre: plaza.nombre,
      descripcion: plaza.descripcion,
      resenaHistorica: plaza.resenaHistorica,
      fechaCreacion: plaza.fechaCreacion,
      estado: plaza.estado,
      ubicacion: plaza.ubicacion,
      latitud: plaza.latitud,
      longitud: plaza.longitud,
      fuentesInformacion: plaza.fuentesInformacion,
      observaciones: plaza.observaciones,
      fotografiaPrincipalId: plaza.fotografiaPrincipalId,
      fechaRegistro: plaza.fechaRegistro,
      fechaModificacion: plaza.fechaModificacion,
    };
  }
}
