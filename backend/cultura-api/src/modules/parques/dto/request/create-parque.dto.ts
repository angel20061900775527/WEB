import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

import {
  LATITUD_MAX,
  LATITUD_MIN,
  LONGITUD_MAX,
  LONGITUD_MIN,
  PARQUE_DESCRIPCION_MAX_LENGTH,
  PARQUE_DESCRIPCION_MIN_LENGTH,
  PARQUE_NOMBRE_MAX_LENGTH,
  PARQUE_NOMBRE_MIN_LENGTH,
  PARQUE_RESENA_MAX_LENGTH,
  PARQUE_UBICACION_MAX_LENGTH,
  PARQUE_UBICACION_MIN_LENGTH,
} from '../../constants/parque.constants';

export class CreateParqueDto {
  @ApiProperty({
    example: 'Parque Central de Zamora',
    description: 'Nombre oficial o común del parque.',
    minLength: PARQUE_NOMBRE_MIN_LENGTH,
    maxLength: PARQUE_NOMBRE_MAX_LENGTH,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MinLength(PARQUE_NOMBRE_MIN_LENGTH, {
    message: `El nombre debe tener al menos ${PARQUE_NOMBRE_MIN_LENGTH} caracteres.`,
  })
  @MaxLength(PARQUE_NOMBRE_MAX_LENGTH, {
    message: `El nombre no puede superar los ${PARQUE_NOMBRE_MAX_LENGTH} caracteres.`,
  })
  declare nombre: string;

  @ApiProperty({
    example: 'Espacio público ubicado en el centro de la ciudad de Zamora.',
    description: 'Descripción general del parque.',
    minLength: PARQUE_DESCRIPCION_MIN_LENGTH,
    maxLength: PARQUE_DESCRIPCION_MAX_LENGTH,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MinLength(PARQUE_DESCRIPCION_MIN_LENGTH, {
    message: `La descripción debe tener al menos ${PARQUE_DESCRIPCION_MIN_LENGTH} caracteres.`,
  })
  @MaxLength(PARQUE_DESCRIPCION_MAX_LENGTH, {
    message: `La descripción no puede superar los ${PARQUE_DESCRIPCION_MAX_LENGTH} caracteres.`,
  })
  declare descripcion: string;

  @ApiPropertyOptional({
    example:
      'El parque fue establecido durante el crecimiento urbano de la ciudad...',
    description: 'Antecedentes o reseña histórica del parque.',
    maxLength: PARQUE_RESENA_MAX_LENGTH,
  })
  @IsOptional()
  @IsString({
    message: 'La reseña histórica debe ser una cadena de texto.',
  })
  @MaxLength(PARQUE_RESENA_MAX_LENGTH, {
    message: `La reseña histórica no puede superar los ${PARQUE_RESENA_MAX_LENGTH} caracteres.`,
  })
  declare resenaHistorica?: string;

  @ApiPropertyOptional({
    example: '1985-05-20',
    description: 'Fecha histórica de creación, en formato AAAA-MM-DD.',
    format: 'date',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'La fecha de creación debe tener un formato de fecha válido.',
    },
  )
  declare fechaCreacion?: string;

  @ApiProperty({
    example: 'Centro de Zamora, entre las calles Sevilla de Oro y Amazonas',
    description: 'Dirección o referencia de ubicación del parque.',
    minLength: PARQUE_UBICACION_MIN_LENGTH,
    maxLength: PARQUE_UBICACION_MAX_LENGTH,
  })
  @IsString({ message: 'La ubicación debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La ubicación es obligatoria.' })
  @MinLength(PARQUE_UBICACION_MIN_LENGTH, {
    message: `La ubicación debe tener al menos ${PARQUE_UBICACION_MIN_LENGTH} caracteres.`,
  })
  @MaxLength(PARQUE_UBICACION_MAX_LENGTH, {
    message: `La ubicación no puede superar los ${PARQUE_UBICACION_MAX_LENGTH} caracteres.`,
  })
  declare ubicacion: string;

  @ApiPropertyOptional({
    example:
      'Archivo Histórico del GADM Zamora; Ordenanza Municipal N.° 015-2024; entrevista al cronista local.',
    description:
      'Documentos, archivos, entrevistas, publicaciones u otras fuentes utilizadas para respaldar la información de la ficha.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString({
    message: 'Las fuentes de información deben ser una cadena de texto.',
  })
  @MaxLength(5000, {
    message:
      'Las fuentes de información no pueden superar los 5000 caracteres.',
  })
  declare fuentesInformacion?: string;

  @ApiPropertyOptional({
    example:
      'La fecha de creación está pendiente de confirmación mediante documentación histórica.',
    description:
      'Notas administrativas o información pendiente de revisión. Este campo no está destinado a la publicación ciudadana.',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString({
    message: 'Las observaciones deben ser una cadena de texto.',
  })
  @MaxLength(2000, {
    message: 'Las observaciones no pueden superar los 2000 caracteres.',
  })
  declare observaciones?: string;

  @ApiPropertyOptional({
    example: -4.0697,
    description: 'Latitud del parque. Debe enviarse junto con la longitud.',
    minimum: LATITUD_MIN,
    maximum: LATITUD_MAX,
  })
  @ValidateIf(
    (dto: CreateParqueDto) =>
      dto.latitud !== undefined || dto.longitud !== undefined,
  )
  @IsDefined({
    message: 'La latitud es obligatoria cuando se registra la longitud.',
  })
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'La latitud debe ser un número válido.' },
  )
  @Min(LATITUD_MIN, {
    message: `La latitud no puede ser menor que ${LATITUD_MIN}.`,
  })
  @Max(LATITUD_MAX, {
    message: `La latitud no puede ser mayor que ${LATITUD_MAX}.`,
  })
  declare latitud?: number;

  @ApiPropertyOptional({
    example: -78.9567,
    description: 'Longitud del parque. Debe enviarse junto con la latitud.',
    minimum: LONGITUD_MIN,
    maximum: LONGITUD_MAX,
  })
  @ValidateIf(
    (dto: CreateParqueDto) =>
      dto.latitud !== undefined || dto.longitud !== undefined,
  )
  @IsDefined({
    message: 'La longitud es obligatoria cuando se registra la latitud.',
  })
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'La longitud debe ser un número válido.' },
  )
  @Min(LONGITUD_MIN, {
    message: `La longitud no puede ser menor que ${LONGITUD_MIN}.`,
  })
  @Max(LONGITUD_MAX, {
    message: `La longitud no puede ser mayor que ${LONGITUD_MAX}.`,
  })
  declare longitud?: number;
}
