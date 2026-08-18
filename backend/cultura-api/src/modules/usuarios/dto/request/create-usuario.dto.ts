import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { RolUsuario } from '../../enums/rol-usuario.enum';

export class CreateUsuarioDto {
  @ApiProperty({
    example: 'jperez',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  username!: string;

  @ApiProperty({
    example: 'Juan',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombres!: string;

  @ApiProperty({
    example: 'Pérez',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  apellidos!: string;

  @ApiProperty({
    example: 'jperez@zamora.gob.ec',
  })
  @IsEmail()
  @MaxLength(150)
  email!: string;

  @ApiProperty({
    enum: RolUsuario,
    example: RolUsuario.CULTURA,
  })
  @IsEnum(RolUsuario)
  rol!: RolUsuario;

  @ApiProperty({
    example: 'Temporal123*',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password!: string;
}
