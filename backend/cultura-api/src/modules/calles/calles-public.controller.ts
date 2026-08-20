import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { CalleResponseDto } from './dto/response/calle-response.dto';
import { CallesService } from './calles.service';

@ApiTags('Público - Calles')
@Controller('public/calles')
export class CallesPublicController {
  constructor(private readonly callesService: CallesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar calles publicadas',
    description:
      'Obtiene un listado público y paginado de calles activas en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Listado público de calles.',
    type: CalleResponseDto,
    isArray: true,
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.callesService.findAllPublic(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener calle publicada por ID',
    description:
      'Obtiene el detalle público de una calle activa en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Detalle público de la calle.',
    type: CalleResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.callesService.findOnePublic(id);
  }
}
