import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TipoPatrimonio } from './enums/tipo-patrimonio.enum';
import { FotografiaResponseDto } from './dto/response/fotografia-response.dto';
import { FotografiasService } from './fotografias.service';

@ApiTags('Público - Fotografías')
@Controller('public/fotografias')
export class FotografiasPublicController {
  constructor(private readonly fotografiasService: FotografiasService) {}

  @Get(':tipoPatrimonio/:registroId')
  @ApiOperation({
    summary: 'Listar fotografías públicas de un registro patrimonial',
    description:
      'Obtiene las fotografías activas de un registro patrimonial activo y publicado.',
  })
  @ApiOkResponse({
    description: 'Listado público de fotografías.',
    type: FotografiaResponseDto,
    isArray: true,
  })
  findAll(
    @Param('tipoPatrimonio', new ParseEnumPipe(TipoPatrimonio))
    tipoPatrimonio: TipoPatrimonio,
    @Param('registroId', ParseIntPipe) registroId: number,
  ) {
    return this.fotografiasService.listarPublicasPorRegistro(
      tipoPatrimonio,
      registroId,
    );
  }
}
