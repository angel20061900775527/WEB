import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Monumento } from '../../entities/monumento.entity';
import { EstadoMonumento } from '../../enums/estado-monumento.enum';
import { TipoMonumento } from '../../enums/tipo-monumento.enum';

export class MonumentoResponseDto {
  @ApiProperty({ example: '1' })
  declare id: number;

  @ApiProperty({
    example: 'Monumento a Naya o la Chapetona',
  })
  declare nombre: string;

  @ApiProperty({
    example:
      'Monumento representativo de la historia y cultura de la ciudad de Zamora.',
  })
  declare descripcion: string;

  @ApiProperty({
    enum: TipoMonumento,
    example: TipoMonumento.ESTATUA,
  })
  declare tipo: TipoMonumento;

  @ApiPropertyOptional({
    example: 'Autor desconocido',
    nullable: true,
  })
  declare autor: string | null;

  @ApiPropertyOptional({
    example: 'Naya o la Chapetona',
    nullable: true,
  })
  declare personajeHomenajeado: string | null;

  @ApiPropertyOptional({
    example:
      'El monumento fue construido para preservar la memoria histórica de la ciudad.',
    nullable: true,
  })
  declare resenaHistorica: string | null;

  @ApiPropertyOptional({
    example: '1995-06-15',
    nullable: true,
  })
  declare fechaConstruccion: string | null;

  @ApiProperty({
    enum: EstadoMonumento,
    example: EstadoMonumento.BORRADOR,
  })
  declare estado: EstadoMonumento;

  @ApiProperty({
    example: 'Parque Central de Zamora',
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
    example:
      'Archivo Histórico del GADM Zamora; documentos de la Dirección de Cultura.',
    nullable: true,
  })
  declare fuentesInformacion: string | null;

  @ApiPropertyOptional({
    example: 'La autoría está pendiente de confirmación documental.',
    nullable: true,
  })
  declare observaciones: string | null;

  @ApiPropertyOptional({
    example: null,
    nullable: true,
  })
  declare fotografiaPrincipalId: string | null;

  @ApiPropertyOptional({
    example:
      'http://localhost:3000/uploads/patrimonio/monumentos/1724051000000-583920134.jpg',
    nullable: true,
  })
  declare fotografiaPrincipalUrl: string | null;

  @ApiProperty({
    example: '2026-08-05T16:00:00.000Z',
  })
  declare fechaRegistro: Date;

  @ApiProperty({
    example: '2026-08-05T16:00:00.000Z',
  })
  declare fechaModificacion: Date;

  static fromEntity(
    monumento: Monumento,
    fotografiaPrincipalUrl: string | null = null,
  ): MonumentoResponseDto {
    return {
      id: monumento.id,
      nombre: monumento.nombre,
      descripcion: monumento.descripcion,
      tipo: monumento.tipo,
      autor: monumento.autor,
      personajeHomenajeado: monumento.personajeHomenajeado,
      resenaHistorica: monumento.resenaHistorica,
      fechaConstruccion: monumento.fechaConstruccion,
      estado: monumento.estado,
      ubicacion: monumento.ubicacion,
      latitud: monumento.latitud,
      longitud: monumento.longitud,
      fuentesInformacion: monumento.fuentesInformacion,
      observaciones: monumento.observaciones,
      fotografiaPrincipalId: monumento.fotografiaPrincipalId,
      fotografiaPrincipalUrl,
      fechaRegistro: monumento.fechaRegistro,
      fechaModificacion: monumento.fechaModificacion,
    };
  }
}
