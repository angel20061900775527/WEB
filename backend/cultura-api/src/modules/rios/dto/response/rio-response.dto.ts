import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Rio } from '../../entities/rio.entity';
import { EstadoConservacionRio } from '../../enums/estado-conservacion-rio.enum';
import { EstadoRio } from '../../enums/estado-rio.enum';
import { TipoRio } from '../../enums/tipo-rio.enum';

export class RioResponseDto {
  @ApiProperty({ example: '1' })
  declare id: number;

  @ApiProperty({ example: 'Río Zamora' })
  declare nombre: string;

  @ApiProperty({
    example:
      'Río de importancia natural, histórica y paisajística para el cantón Zamora.',
  })
  declare descripcion: string;

  @ApiPropertyOptional({
    example:
      'El río ha sido históricamente utilizado como referente territorial y espacio recreativo.',
    nullable: true,
  })
  declare resenaHistorica: string | null;

  @ApiProperty({
    enum: EstadoRio,
    example: EstadoRio.BORRADOR,
  })
  declare estado: EstadoRio;

  @ApiProperty({
    example: 'Cantón Zamora',
  })
  declare ubicacion: string;

  @ApiPropertyOptional({
    example: 183.5,
    nullable: true,
  })
  declare longitudKm: number | null;

  @ApiPropertyOptional({
    example: 'Cuenca del río Santiago',
    nullable: true,
  })
  declare cuencaHidrografica: string | null;

  @ApiPropertyOptional({
    example: 'Río Santiago',
    nullable: true,
  })
  declare afluenteDe: string | null;

  @ApiProperty({
    enum: EstadoConservacionRio,
    example: EstadoConservacionRio.BUENO,
  })
  declare estadoConservacion: EstadoConservacionRio;

  @ApiProperty({
    enum: TipoRio,
    example: TipoRio.PRINCIPAL,
  })
  declare tipo: TipoRio;

  @ApiProperty({
    example: true,
  })
  declare aptoBalneario: boolean;

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
      'Archivo Histórico del GADM Zamora; estudios ambientales y registros institucionales.',
    nullable: true,
  })
  declare fuentesInformacion: string | null;

  @ApiPropertyOptional({
    example:
      'La aptitud para balneario debe revisarse periódicamente conforme a las condiciones del agua.',
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

  static fromEntity(rio: Rio): RioResponseDto {
    return {
      id: rio.id,
      nombre: rio.nombre,
      descripcion: rio.descripcion,
      resenaHistorica: rio.resenaHistorica,
      estado: rio.estado,
      ubicacion: rio.ubicacion,
      longitudKm: rio.longitudKm,
      cuencaHidrografica: rio.cuencaHidrografica,
      afluenteDe: rio.afluenteDe,
      estadoConservacion: rio.estadoConservacion,
      tipo: rio.tipo,
      aptoBalneario: rio.aptoBalneario,
      latitud: rio.latitud,
      longitud: rio.longitud,
      fuentesInformacion: rio.fuentesInformacion,
      observaciones: rio.observaciones,
      fotografiaPrincipalId: rio.fotografiaPrincipalId,
      fechaRegistro: rio.fechaRegistro,
      fechaModificacion: rio.fechaModificacion,
    };
  }
}
