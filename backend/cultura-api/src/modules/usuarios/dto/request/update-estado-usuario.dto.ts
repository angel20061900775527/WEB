import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateEstadoUsuarioDto {
  @ApiProperty({
    example: true,
    description: 'Indica si el usuario se encuentra activo.',
  })
  @IsBoolean()
  activo!: boolean;
}
