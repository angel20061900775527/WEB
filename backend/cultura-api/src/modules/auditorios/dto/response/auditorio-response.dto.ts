import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Auditorio } from '../../entities/auditorio.entity';
import { EstadoAuditorio } from '../../enums/estado-auditorio.enum';

export class AuditorioResponseDto {
  @ApiProperty({ example: '1' })
  declare id: number;

  @ApiProperty({
    example: 'Auditorio Municipal de Zamora',
  })
  declare nombre: string;

  @ApiProperty({
    example:
      'Espacio destinado a la conservación y difusión de la historia y cultura local.',
  })
  declare descripcion: string;

  @ApiPropertyOptional({
    example:
      'El auditorio conserva colecciones relacionadas con la historia del cantón Zamora.',
    nullable: true,
  })
  declare resenaHistorica: string | null;

  @ApiProperty({
    enum: EstadoAuditorio,
    example: EstadoAuditorio.BORRADOR,
  })
  declare estado: EstadoAuditorio;

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

  @ApiProperty({
    example: '2026-08-07T16:00:00.000Z',
  })
  declare fechaRegistro: Date;

  @ApiProperty({
    example: '2026-08-07T16:00:00.000Z',
  })
  declare fechaModificacion: Date;

  static fromEntity(auditorio: Auditorio): AuditorioResponseDto {
    return {
      id: auditorio.id,
      nombre: auditorio.nombre,
      descripcion: auditorio.descripcion,
      resenaHistorica: auditorio.resenaHistorica,
      estado: auditorio.estado,
      ubicacion: auditorio.ubicacion,
      horarioAtencion: auditorio.horarioAtencion,
      responsable: auditorio.responsable,
      sitioWeb: auditorio.sitioWeb,
      latitud: auditorio.latitud,
      longitud: auditorio.longitud,
      fuentesInformacion: auditorio.fuentesInformacion,
      observaciones: auditorio.observaciones,
      fotografiaPrincipalId: auditorio.fotografiaPrincipalId,
      fechaRegistro: auditorio.fechaRegistro,
      fechaModificacion: auditorio.fechaModificacion,
    };
  }
}
