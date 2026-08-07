import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

import { BasePatrimonialDto } from '../../../../common/dto/request/base-patrimonial.dto';

export class CreatePlazaDto extends BasePatrimonialDto {
  @ApiPropertyOptional({
    example: '1950-08-15',
    description: 'Fecha histórica de creación o inauguración de la plaza.',
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
}
