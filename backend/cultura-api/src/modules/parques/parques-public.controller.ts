import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { ParqueResponseDto } from './dto/response/parque-response.dto';
import { ParquesService } from './parques.service';

@ApiTags('Público - Parques')
@Controller('public/parques')
export class ParquesPublicController {
  constructor(private readonly parquesService: ParquesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar parques publicados',
    description:
      'Obtiene un listado público y paginado de parques activos en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Listado público de parques.',
    type: ParqueResponseDto,
    isArray: true,
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.parquesService.findAllPublic(query);
  }
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener parque publicado por ID',
    description:
      'Obtiene el detalle público de un parque activo en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Detalle público del parque.',
    type: ParqueResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parquesService.findOnePublic(id);
  }
}
