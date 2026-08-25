import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Parque } from '../../entities/parque.entity';
import { EstadoParque } from '../../enums/estado-parque.enum';

export class ParqueResponseDto {
  @ApiProperty({ example: '1' })
  declare id: number;

  @ApiProperty({ example: 'Parque Central de Zamora' })
  declare nombre: string;

  @ApiProperty({
    example: 'Espacio público ubicado en el centro de Zamora.',
  })
  declare descripcion: string;

  @ApiPropertyOptional({
    example: 'Parque tradicional del centro urbano.',
    nullable: true,
  })
  declare resenaHistorica: string | null;

  @ApiPropertyOptional({
    example: '1985-05-20',
    nullable: true,
  })
  declare fechaCreacion: string | null;

  @ApiProperty({
    enum: EstadoParque,
    example: EstadoParque.BORRADOR,
  })
  declare estado: EstadoParque;

  @ApiProperty({
    example: 'Centro de Zamora, calles Sevilla de Oro y Amazonas',
  })
  declare ubicacion: string;

  @ApiPropertyOptional({ example: -4.0697, nullable: true })
  declare latitud: number | null;

  @ApiPropertyOptional({ example: -78.9567, nullable: true })
  declare longitud: number | null;

  @ApiPropertyOptional({
    example:
      'Archivo Histórico del GADM Zamora; Ordenanza Municipal No. 015-2024.',
    nullable: true,
  })
  declare fuentesInformacion: string | null;

  @ApiPropertyOptional({
    example: 'Información pendiente de validación por la Dirección de Cultura.',
    nullable: true,
  })
  declare observaciones: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  declare fotografiaPrincipalId: string | null;

  @ApiPropertyOptional({
    example:
      'http://localhost:3000/uploads/patrimonio/parques/1724051000000-583920134.jpg',
    nullable: true,
  })
  declare fotografiaPrincipalUrl: string | null;

  @ApiProperty({ example: '2026-07-31T17:03:23.989Z' })
  declare fechaRegistro: Date;

  @ApiProperty({ example: '2026-07-31T17:03:23.989Z' })
  declare fechaModificacion: Date;

  static fromEntity(
    parque: Parque,
    fotografiaPrincipalUrl: string | null = null,
  ): ParqueResponseDto {
    return {
      id: parque.id,
      nombre: parque.nombre,
      descripcion: parque.descripcion,
      resenaHistorica: parque.resenaHistorica,
      fechaCreacion: parque.fechaCreacion,
      estado: parque.estado,
      ubicacion: parque.ubicacion,
      latitud: parque.latitud,
      longitud: parque.longitud,
      fuentesInformacion: parque.fuentesInformacion,
      observaciones: parque.observaciones,
      fotografiaPrincipalId: parque.fotografiaPrincipalId,
      fotografiaPrincipalUrl,
      fechaRegistro: parque.fechaRegistro,
      fechaModificacion: parque.fechaModificacion,
    };
  }
}
