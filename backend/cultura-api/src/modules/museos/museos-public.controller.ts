import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { MuseoResponseDto } from './dto/response/museo-response.dto';
import { MuseosService } from './museos.service';

@ApiTags('Público - Museos')
@Controller('public/museos')
export class MuseosPublicController {
  constructor(private readonly museosService: MuseosService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar museos publicados',
    description:
      'Obtiene un listado público y paginado de museos activos en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Listado público de museos.',
    type: MuseoResponseDto,
    isArray: true,
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.museosService.findAllPublic(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener museo publicado por ID',
    description:
      'Obtiene el detalle público de un museo activo en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Detalle público del museo.',
    type: MuseoResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.museosService.findOnePublic(id);
  }
}
