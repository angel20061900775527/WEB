import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { RioResponseDto } from './dto/response/rio-response.dto';
import { RiosService } from './rios.service';

@ApiTags('Público - Ríos')
@Controller('public/rios')
export class RiosPublicController {
  constructor(private readonly riosService: RiosService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar ríos publicados',
    description:
      'Obtiene un listado público y paginado de ríos activos en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Listado público de ríos.',
    type: RioResponseDto,
    isArray: true,
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.riosService.findAllPublic(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener río publicado por ID',
    description:
      'Obtiene el detalle público de un río activo en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Detalle público del río.',
    type: RioResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.riosService.findOnePublic(id);
  }
}
