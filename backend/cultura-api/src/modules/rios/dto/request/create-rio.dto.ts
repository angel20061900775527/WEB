import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
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
import { EstadoConservacionRio } from '../../enums/estado-conservacion-rio.enum';
import { TipoRio } from '../../enums/tipo-rio.enum';

export class CreateRioDto {
  @ApiProperty({
    example: 'Río Zamora',
    description: 'Nombre oficial o común del río.',
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
      'Río de importancia natural, histórica y paisajística para el cantón Zamora.',
    description: 'Descripción general del río.',
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
      'El río ha sido históricamente utilizado como referente territorial y espacio recreativo.',
    description: 'Antecedentes o reseña histórica del río.',
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
    description: 'Ubicación o referencia geográfica del río.',
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
    example: 183.5,
    description: 'Longitud aproximada del río en kilómetros.',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'La longitud del río debe ser un número válido.' },
  )
  @Min(0, {
    message: 'La longitud del río no puede ser negativa.',
  })
  declare longitudKm?: number;

  @ApiPropertyOptional({
    example: 'Cuenca del río Santiago',
    description: 'Cuenca hidrográfica a la que pertenece el río.',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({
    message: 'La cuenca hidrográfica debe ser una cadena de texto.',
  })
  @MaxLength(255, {
    message: 'La cuenca hidrográfica no puede superar los 255 caracteres.',
  })
  declare cuencaHidrografica?: string;

  @ApiPropertyOptional({
    example: 'Río Santiago',
    description: 'Río o sistema hidrográfico del cual es afluente.',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({
    message: 'El campo afluente de debe ser una cadena de texto.',
  })
  @MaxLength(255, {
    message: 'El campo afluente de no puede superar los 255 caracteres.',
  })
  declare afluenteDe?: string;

  @ApiProperty({
    enum: EstadoConservacionRio,
    example: EstadoConservacionRio.BUENO,
    description: 'Estado general de conservación del río.',
  })
  @IsEnum(EstadoConservacionRio, {
    message:
      'El estado de conservación debe ser EXCELENTE, BUENO, REGULAR o DETERIORADO.',
  })
  declare estadoConservacion: EstadoConservacionRio;

  @ApiProperty({
    enum: TipoRio,
    example: TipoRio.PRINCIPAL,
    description: 'Tipo o clasificación del río.',
  })
  @IsEnum(TipoRio, {
    message: 'El tipo de río debe ser PRINCIPAL, AFLUENTE, QUEBRADA o ESTERO.',
  })
  declare tipo: TipoRio;

  @ApiProperty({
    example: true,
    description:
      'Indica si el río posee condiciones consideradas aptas para uso como balneario.',
  })
  @IsBoolean({
    message: 'El campo apto para balneario debe ser verdadero o falso.',
  })
  declare aptoBalneario: boolean;

  @ApiPropertyOptional({
    example:
      'Archivo Histórico del GADM Zamora; estudios ambientales y registros institucionales.',
    description:
      'Documentos, archivos o publicaciones que respaldan la información.',
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
      'La aptitud para balneario debe ser verificada periódicamente conforme a las condiciones del agua.',
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
    description:
      'Latitud referencial del río. Debe enviarse junto con la longitud.',
    minimum: LATITUD_MIN,
    maximum: LATITUD_MAX,
  })
  @ValidateIf(
    (dto: CreateRioDto) =>
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
      'Longitud referencial del río. Debe enviarse junto con la latitud.',
    minimum: LONGITUD_MIN,
    maximum: LONGITUD_MAX,
  })
  @ValidateIf(
    (dto: CreateRioDto) =>
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
