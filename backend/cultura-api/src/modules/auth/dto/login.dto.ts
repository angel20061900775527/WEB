import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  declare username: string;

  @ApiProperty({
    example: 'MiClaveSegura123',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  declare password: string;
}
