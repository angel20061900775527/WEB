import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Fotografia } from '../../entities/fotografia.entity';
import { TipoPatrimonio } from '../../enums/tipo-patrimonio.enum';

export class FotografiaResponseDto {
  @ApiProperty({
    example: '1',
  })
  declare id: string;

  @ApiProperty({
    enum: TipoPatrimonio,
    example: TipoPatrimonio.PARQUE,
  })
  declare tipoPatrimonio: TipoPatrimonio;

  @ApiProperty({
    example: '7',
  })
  declare registroId: string;

  @ApiProperty({
    example: 'parque-central.jpg',
  })
  declare nombreOriginal: string;

  @ApiProperty({
    example: '1724051000000-583920134.jpg',
  })
  declare nombreArchivo: string;

  @ApiProperty({
    example: 'image/jpeg',
  })
  declare mimeType: string;

  @ApiProperty({
    example: '2458100',
  })
  declare tamanioBytes: string;

  @ApiProperty({
    example: 'uploads/patrimonio/parques/1724051000000-583920134.jpg',
  })
  declare ruta: string;

  @ApiProperty({
    example:
      'http://localhost:3000/uploads/patrimonio/parques/1724051000000-583920134.jpg',
  })
  declare url: string;

  @ApiPropertyOptional({
    example: 'Vista principal del parque.',
    nullable: true,
  })
  declare descripcion: string | null;

  @ApiProperty({
    example: '2026-08-19T16:00:00.000Z',
  })
  declare fechaRegistro: Date;

  static fromEntity(fotografia: Fotografia): FotografiaResponseDto {
    const rutaNormalizada = fotografia.ruta.replace(/\\/g, '/');

    const rutaPublica = rutaNormalizada.startsWith('uploads/')
      ? `/${rutaNormalizada}`
      : `/uploads/${rutaNormalizada}`;

    return {
      id: String(fotografia.id),
      tipoPatrimonio: fotografia.tipoPatrimonio,
      registroId: String(fotografia.registroId),
      nombreOriginal: fotografia.nombreOriginal,
      nombreArchivo: fotografia.nombreArchivo,
      mimeType: fotografia.mimeType,
      tamanioBytes: String(fotografia.tamanioBytes),
      ruta: rutaNormalizada,
      url: `http://localhost:3000${rutaPublica}`,
      descripcion: fotografia.descripcion,
      fechaRegistro: fotografia.fechaRegistro,
    };
  }
}
