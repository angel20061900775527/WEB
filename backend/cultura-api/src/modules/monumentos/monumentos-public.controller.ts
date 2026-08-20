import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { MonumentoResponseDto } from './dto/response/monumento-response.dto';
import { MonumentosService } from './monumentos.service';

@ApiTags('Público - Monumentos')
@Controller('public/monumentos')
export class MonumentosPublicController {
  constructor(private readonly monumentosService: MonumentosService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar monumentos publicados',
    description:
      'Obtiene un listado público y paginado de monumentos activos en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Listado público de monumentos.',
    type: MonumentoResponseDto,
    isArray: true,
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.monumentosService.findAllPublic(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener monumento publicado por ID',
    description:
      'Obtiene el detalle público de un monumento activo en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Detalle público del monumento.',
    type: MonumentoResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.monumentosService.findOnePublic(id);
  }
}
