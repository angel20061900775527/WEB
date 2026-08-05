import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsEnum,
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
import { TipoMonumento } from '../../enums/tipo-monumento.enum';

export class CreateMonumentoDto {
  @ApiProperty({
    example: 'Monumento a Naya o la Chapetona',
    description: 'Nombre oficial o común del monumento.',
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
      'Monumento representativo de la historia y cultura de la ciudad de Zamora.',
    description: 'Descripción general del monumento.',
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

  @ApiProperty({
    enum: TipoMonumento,
    example: TipoMonumento.ESTATUA,
    description: 'Tipo o clasificación del monumento.',
  })
  @IsEnum(TipoMonumento, {
    message:
      'El tipo de monumento debe ser ESTATUA, BUSTO, ESCULTURA, OBELISCO, MONOLITO, PLACA, MEMORIAL, FUENTE u OTRO.',
  })
  declare tipo: TipoMonumento;

  @ApiPropertyOptional({
    example: 'Autor desconocido',
    description: 'Nombre del autor, escultor o creador del monumento.',
    maxLength: 150,
  })
  @IsOptional()
  @IsString({ message: 'El autor debe ser una cadena de texto.' })
  @MaxLength(150, {
    message: 'El autor no puede superar los 150 caracteres.',
  })
  declare autor?: string;

  @ApiPropertyOptional({
    example: 'Naya o la Chapetona',
    description:
      'Nombre del personaje o acontecimiento al que está dedicado el monumento.',
    maxLength: 150,
  })
  @IsOptional()
  @IsString({
    message: 'El personaje homenajeado debe ser una cadena de texto.',
  })
  @MaxLength(150, {
    message: 'El personaje homenajeado no puede superar los 150 caracteres.',
  })
  declare personajeHomenajeado?: string;

  @ApiPropertyOptional({
    example:
      'El monumento fue construido para preservar la memoria histórica de la ciudad.',
    description: 'Antecedentes o reseña histórica del monumento.',
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
    example: '1995-06-15',
    description:
      'Fecha de construcción o inauguración del monumento, en formato AAAA-MM-DD.',
    format: 'date',
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'La fecha de construcción debe tener un formato de fecha válido.',
    },
  )
  declare fechaConstruccion?: string;

  @ApiProperty({
    example: 'Parque Central de Zamora',
    description: 'Dirección o referencia de ubicación del monumento.',
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
    example:
      'Archivo Histórico del GADM Zamora; documentos de la Dirección de Cultura.',
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
    example: 'La autoría del monumento está pendiente de confirmación.',
    description: 'Notas administrativas o información pendiente de revisión.',
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
    description: 'Latitud del monumento. Debe enviarse junto con la longitud.',
    minimum: LATITUD_MIN,
    maximum: LATITUD_MAX,
  })
  @ValidateIf(
    (dto: CreateMonumentoDto) =>
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
    description: 'Longitud del monumento. Debe enviarse junto con la latitud.',
    minimum: LONGITUD_MIN,
    maximum: LONGITUD_MAX,
  })
  @ValidateIf(
    (dto: CreateMonumentoDto) =>
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
