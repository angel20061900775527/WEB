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
} from '../../../../common/constants/ficha-patrimonial.constants';

export class CreateCalleDto {
  @ApiProperty({
    example: 'Calle Sevilla de Oro',
    description: 'Nombre oficial o común de la calle.',
    minLength: FICHA_NOMBRE_MIN_LENGTH,
    maxLength: FICHA_NOMBRE_MAX_LENGTH,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MinLength(FICHA_NOMBRE_MIN_LENGTH, {
    message: `El nombre debe tener al menos ${FICHA_NOMBRE_MIN_LENGTH} caracteres.`,
  })
  @MaxLength(FICHA_NOMBRE_MAX_LENGTH, {
    message: `El nombre no puede superar los ${FICHA_NOMBRE_MAX_LENGTH} caracteres.`,
  })
  declare nombre: string;

  @ApiProperty({
    example:
      'Vía urbana ubicada en el centro de la ciudad de Zamora, reconocida por su importancia histórica.',
    description: 'Descripción general de la calle.',
    minLength: FICHA_DESCRIPCION_MIN_LENGTH,
    maxLength: FICHA_DESCRIPCION_MAX_LENGTH,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MinLength(FICHA_DESCRIPCION_MIN_LENGTH, {
    message: `La descripción debe tener al menos ${FICHA_DESCRIPCION_MIN_LENGTH} caracteres.`,
  })
  @MaxLength(FICHA_DESCRIPCION_MAX_LENGTH, {
    message: `La descripción no puede superar los ${FICHA_DESCRIPCION_MAX_LENGTH} caracteres.`,
  })
  declare descripcion: string;

  @ApiPropertyOptional({
    example:
      'La calle recibió su nombre en reconocimiento a la antigua denominación histórica de la ciudad.',
    description: 'Antecedentes o reseña histórica de la calle.',
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

  @ApiPropertyOptional({
    example: '1985-05-20',
    description:
      'Fecha de denominación oficial de la calle, en formato AAAA-MM-DD.',
    format: 'date',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'La fecha de denominación debe tener un formato de fecha válido.',
    },
  )
  declare fechaDenominacion?: string;

  @ApiProperty({
    example: 'Centro urbano de Zamora',
    description: 'Dirección o referencia general de ubicación de la calle.',
    minLength: FICHA_UBICACION_MIN_LENGTH,
    maxLength: FICHA_UBICACION_MAX_LENGTH,
  })
  @IsString({ message: 'La ubicación debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La ubicación es obligatoria.' })
  @MinLength(FICHA_UBICACION_MIN_LENGTH, {
    message: `La ubicación debe tener al menos ${FICHA_UBICACION_MIN_LENGTH} caracteres.`,
  })
  @MaxLength(FICHA_UBICACION_MAX_LENGTH, {
    message: `La ubicación no puede superar los ${FICHA_UBICACION_MAX_LENGTH} caracteres.`,
  })
  declare ubicacion: string;

  @ApiPropertyOptional({
    example: 'Barrio Central',
    description: 'Sector o barrio en el que se encuentra la calle.',
    maxLength: 150,
  })
  @IsOptional()
  @IsString({ message: 'El sector debe ser una cadena de texto.' })
  @MaxLength(150, {
    message: 'El sector no puede superar los 150 caracteres.',
  })
  declare sector?: string;

  @ApiPropertyOptional({
    example:
      'Archivo Histórico del GADM Zamora; ordenanzas municipales; entrevistas a moradores del sector.',
    description:
      'Documentos, archivos, entrevistas o publicaciones que respaldan la información de la ficha.',
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
    example:
      'La fecha de denominación está pendiente de confirmación documental.',
    description:
      'Notas administrativas o información pendiente de verificación.',
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
    description:
      'Latitud referencial de la calle. Debe enviarse junto con la longitud.',
    minimum: LATITUD_MIN,
    maximum: LATITUD_MAX,
  })
  @ValidateIf(
    (dto: CreateCalleDto) =>
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
    description:
      'Longitud referencial de la calle. Debe enviarse junto con la latitud.',
    minimum: LONGITUD_MIN,
    maximum: LONGITUD_MAX,
  })
  @ValidateIf(
    (dto: CreateCalleDto) =>
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
