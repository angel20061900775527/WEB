import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Museo } from '../../entities/museo.entity';
import { EstadoMuseo } from '../../enums/estado-museo.enum';

export class MuseoResponseDto {
  @ApiProperty({ example: '1' })
  declare id: number;

  @ApiProperty({
    example: 'Museo Municipal de Zamora',
  })
  declare nombre: string;

  @ApiProperty({
    example:
      'Espacio destinado a la conservación y difusión de la historia y cultura local.',
  })
  declare descripcion: string;

  @ApiPropertyOptional({
    example:
      'El museo conserva colecciones relacionadas con la historia del cantón Zamora.',
    nullable: true,
  })
  declare resenaHistorica: string | null;

  @ApiProperty({
    enum: EstadoMuseo,
    example: EstadoMuseo.BORRADOR,
  })
  declare estado: EstadoMuseo;

  @ApiProperty({
    example: 'Centro de la ciudad de Zamora',
  })
  declare ubicacion: string;

  @ApiPropertyOptional({
    example: 'Lunes a viernes de 08:00 a 17:00',
    nullable: true,
  })
  declare horarioAtencion: string | null;

  @ApiPropertyOptional({
    example: 'Dirección de Cultura del GADM Zamora',
    nullable: true,
  })
  declare responsable: string | null;

  @ApiPropertyOptional({
    example: 'https://www.zamora.gob.ec',
    nullable: true,
  })
  declare sitioWeb: string | null;

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
    example: 'Información pendiente de revisión documental.',
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
      'http://localhost:3000/uploads/patrimonio/museos/1724051000000-583920134.jpg',
    nullable: true,
  })
  declare fotografiaPrincipalUrl: string | null;

  @ApiProperty({
    example: '2026-08-07T16:00:00.000Z',
  })
  declare fechaRegistro: Date;

  @ApiProperty({
    example: '2026-08-07T16:00:00.000Z',
  })
  declare fechaModificacion: Date;

  static fromEntity(
    museo: Museo,
    fotografiaPrincipalUrl: string | null = null,
  ): MuseoResponseDto {
    return {
      id: museo.id,
      nombre: museo.nombre,
      descripcion: museo.descripcion,
      resenaHistorica: museo.resenaHistorica,
      estado: museo.estado,
      ubicacion: museo.ubicacion,
      horarioAtencion: museo.horarioAtencion,
      responsable: museo.responsable,
      sitioWeb: museo.sitioWeb,
      latitud: museo.latitud,
      longitud: museo.longitud,
      fuentesInformacion: museo.fuentesInformacion,
      observaciones: museo.observaciones,
      fotografiaPrincipalId: museo.fotografiaPrincipalId,
      fotografiaPrincipalUrl,
      fechaRegistro: museo.fechaRegistro,
      fechaModificacion: museo.fechaModificacion,
    };
  }
}
