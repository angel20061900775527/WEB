import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { PlazaResponseDto } from './dto/response/plaza-response.dto';
import { PlazasService } from './plazas.service';

@ApiTags('Público - Plazas')
@Controller('public/plazas')
export class PlazasPublicController {
  constructor(private readonly plazasService: PlazasService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar plazas publicadas',
    description:
      'Obtiene un listado público y paginado de plazas activas en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Listado público de plazas.',
    type: PlazaResponseDto,
    isArray: true,
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.plazasService.findAllPublic(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener plaza publicada por ID',
    description:
      'Obtiene el detalle público de una plaza activa en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Detalle público de la plaza.',
    type: PlazaResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.plazasService.findOnePublic(id);
  }
}
