import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Número de página.',
    example: 1,
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero.' })
  @Min(1, { message: 'La página debe ser mayor o igual a 1.' })
  page = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de registros por página.',
    example: 10,
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero.' })
  @Min(1, { message: 'El límite debe ser mayor o igual a 1.' })
  @Max(100, { message: 'El límite no puede superar 100 registros.' })
  limit = 10;

  @ApiPropertyOptional({
    description: 'Texto para buscar por nombre.',
    example: 'central',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser una cadena de texto.' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Orden alfabético de los resultados.',
    example: 'ASC',
    default: 'ASC',
    enum: ['ASC', 'DESC'],
    type: String,
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'], {
    message: 'El orden debe ser ASC o DESC.',
  })
  order: 'ASC' | 'DESC' = 'ASC';
}
