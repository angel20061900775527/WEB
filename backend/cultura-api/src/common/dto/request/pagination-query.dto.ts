import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Número de página.',
    type: Number,
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de registros por página.',
    type: Number,
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Texto para búsqueda.',
    type: String,
    example: 'central',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado.',
    type: String,
    example: 'PUBLICADO',
    enum: ['BORRADOR', 'PUBLICADO', 'INACTIVO'],
  })
  @IsOptional()
  @IsIn(['BORRADOR', 'PUBLICADO', 'INACTIVO'])
  estado?: 'BORRADOR' | 'PUBLICADO' | 'INACTIVO';

  @ApiPropertyOptional({
    description: 'Orden ASC o DESC.',
    type: String,
    example: 'ASC',
    default: 'ASC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'ASC';
}
