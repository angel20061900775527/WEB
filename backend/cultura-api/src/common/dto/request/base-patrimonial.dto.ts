import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
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
  FICHA_DESCRIPCION_MAX_LENGTH,
  FICHA_DESCRIPCION_MIN_LENGTH,
  FICHA_FUENTES_MAX_LENGTH,
  FICHA_NOMBRE_MAX_LENGTH,
  FICHA_NOMBRE_MIN_LENGTH,
  FICHA_OBSERVACIONES_MAX_LENGTH,
  FICHA_RESENA_MAX_LENGTH,
  FICHA_UBICACION_MAX_LENGTH,
  FICHA_UBICACION_MIN_LENGTH,
  LATITUD_MAX,
  LATITUD_MIN,
  LONGITUD_MAX,
  LONGITUD_MIN,
} from '../../constants/ficha-patrimonial.constants';

export abstract class BasePatrimonialDto {
  @ApiProperty({
    example: 'Nombre de la ficha patrimonial',
    description: 'Nombre oficial o común del elemento patrimonial.',
    minLength: FICHA_NOMBRE_MIN_LENGTH,
    maxLength: FICHA_NOMBRE_MAX_LENGTH,
  })
  @IsString({
    message: 'El nombre debe ser una cadena de texto.',
  })
  @IsNotEmpty({
    message: 'El nombre es obligatorio.',
  })
  @MinLength(FICHA_NOMBRE_MIN_LENGTH, {
    message: `El nombre debe tener al menos ${FICHA_NOMBRE_MIN_LENGTH} caracteres.`,
  })
  @MaxLength(FICHA_NOMBRE_MAX_LENGTH, {
    message: `El nombre no puede superar los ${FICHA_NOMBRE_MAX_LENGTH} caracteres.`,
  })
  declare nombre: string;

  @ApiProperty({
    example: 'Descripción general del elemento patrimonial.',
    description: 'Descripción general de la ficha patrimonial.',
    minLength: FICHA_DESCRIPCION_MIN_LENGTH,
    maxLength: FICHA_DESCRIPCION_MAX_LENGTH,
  })
  @IsString({
    message: 'La descripción debe ser una cadena de texto.',
  })
  @IsNotEmpty({
    message: 'La descripción es obligatoria.',
  })
  @MinLength(FICHA_DESCRIPCION_MIN_LENGTH, {
    message: `La descripción debe tener al menos ${FICHA_DESCRIPCION_MIN_LENGTH} caracteres.`,
  })
  @MaxLength(FICHA_DESCRIPCION_MAX_LENGTH, {
    message: `La descripción no puede superar los ${FICHA_DESCRIPCION_MAX_LENGTH} caracteres.`,
  })
  declare descripcion: string;

  @ApiPropertyOptional({
    example: 'Antecedentes históricos del elemento patrimonial.',
    description: 'Antecedentes o reseña histórica.',
    maxLength: FICHA_RESENA_MAX_LENGTH,
  })
  @IsOptional()
  @IsString({
    message: 'La reseña histórica debe ser una cadena de texto.',
  })
  @MaxLength(FICHA_RESENA_MAX_LENGTH, {
    message: `La reseña histórica no puede superar los ${FICHA_RESENA_MAX_LENGTH} caracteres.`,
  })
  declare resenaHistorica?: string;

  @ApiProperty({
    example: 'Cantón Zamora',
    description: 'Dirección o referencia de ubicación.',
    minLength: FICHA_UBICACION_MIN_LENGTH,
    maxLength: FICHA_UBICACION_MAX_LENGTH,
  })
  @IsString({
    message: 'La ubicación debe ser una cadena de texto.',
  })
  @IsNotEmpty({
    message: 'La ubicación es obligatoria.',
  })
  @MinLength(FICHA_UBICACION_MIN_LENGTH, {
    message: `La ubicación debe tener al menos ${FICHA_UBICACION_MIN_LENGTH} caracteres.`,
  })
  @MaxLength(FICHA_UBICACION_MAX_LENGTH, {
    message: `La ubicación no puede superar los ${FICHA_UBICACION_MAX_LENGTH} caracteres.`,
  })
  declare ubicacion: string;

  @ApiPropertyOptional({
    example: 'Archivo Histórico del GADM Zamora; documentos institucionales.',
    description:
      'Documentos, archivos, entrevistas o publicaciones que respaldan la información.',
    maxLength: FICHA_FUENTES_MAX_LENGTH,
  })
  @IsOptional()
  @IsString({
    message: 'Las fuentes de información deben ser una cadena de texto.',
  })
  @MaxLength(FICHA_FUENTES_MAX_LENGTH, {
    message: `Las fuentes de información no pueden superar los ${FICHA_FUENTES_MAX_LENGTH} caracteres.`,
  })
  declare fuentesInformacion?: string;

  @ApiPropertyOptional({
    example: 'Información pendiente de revisión documental.',
    description:
      'Observaciones administrativas o información pendiente de verificación.',
    maxLength: FICHA_OBSERVACIONES_MAX_LENGTH,
  })
  @IsOptional()
  @IsString({
    message: 'Las observaciones deben ser una cadena de texto.',
  })
  @MaxLength(FICHA_OBSERVACIONES_MAX_LENGTH, {
    message: `Las observaciones no pueden superar los ${FICHA_OBSERVACIONES_MAX_LENGTH} caracteres.`,
  })
  declare observaciones?: string;

  @ApiPropertyOptional({
    example: -4.0697,
    description: 'Latitud. Debe enviarse junto con la longitud.',
    minimum: LATITUD_MIN,
    maximum: LATITUD_MAX,
  })
  @ValidateIf(
    (dto: BasePatrimonialDto) =>
      dto.latitud !== undefined || dto.longitud !== undefined,
  )
  @IsDefined({
    message: 'La latitud es obligatoria cuando se registra la longitud.',
  })
  @Type(() => Number)
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    {
      message: 'La latitud debe ser un número válido.',
    },
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
    description: 'Longitud. Debe enviarse junto con la latitud.',
    minimum: LONGITUD_MIN,
    maximum: LONGITUD_MAX,
  })
  @ValidateIf(
    (dto: BasePatrimonialDto) =>
      dto.latitud !== undefined || dto.longitud !== undefined,
  )
  @IsDefined({
    message: 'La longitud es obligatoria cuando se registra la latitud.',
  })
  @Type(() => Number)
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    {
      message: 'La longitud debe ser un número válido.',
    },
  )
  @Min(LONGITUD_MIN, {
    message: `La longitud no puede ser menor que ${LONGITUD_MIN}.`,
  })
  @Max(LONGITUD_MAX, {
    message: `La longitud no puede ser mayor que ${LONGITUD_MAX}.`,
  })
  declare longitud?: number;
}
