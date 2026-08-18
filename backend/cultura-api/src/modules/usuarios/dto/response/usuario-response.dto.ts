import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Usuario } from '../../entities/usuario.entity';
import { RolUsuario } from '../../enums/rol-usuario.enum';

export class UsuarioResponseDto {
  @ApiProperty({
    example: 1,
  })
  declare id: number;

  @ApiProperty({
    example: 'jperez',
  })
  declare username: string;

  @ApiProperty({
    example: 'Juan',
  })
  declare nombres: string;

  @ApiProperty({
    example: 'Pérez',
  })
  declare apellidos: string;

  @ApiProperty({
    example: 'jperez@zamora.gob.ec',
  })
  declare email: string;

  @ApiProperty({
    enum: RolUsuario,
    example: RolUsuario.CULTURA,
  })
  declare rol: RolUsuario;

  @ApiProperty({
    example: true,
  })
  declare activo: boolean;

  @ApiPropertyOptional({
    example: '2026-08-18T14:30:00.000Z',
    nullable: true,
  })
  declare ultimoAcceso: Date | null;

  static fromEntity(usuario: Usuario): UsuarioResponseDto {
    return {
      id: usuario.id,
      username: usuario.username,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
      ultimoAcceso: usuario.ultimoAcceso,
    };
  }
}
