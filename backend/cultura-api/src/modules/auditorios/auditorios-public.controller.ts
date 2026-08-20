import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { AuditorioResponseDto } from './dto/response/auditorio-response.dto';
import { AuditoriosService } from './auditorios.service';

@ApiTags('Público - Auditorios')
@Controller('public/auditorios')
export class AuditoriosPublicController {
  constructor(private readonly auditoriosService: AuditoriosService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar auditorios publicados',
    description:
      'Obtiene un listado público y paginado de auditorios activos en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Listado público de auditorios.',
    type: AuditorioResponseDto,
    isArray: true,
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.auditoriosService.findAllPublic(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener auditorio publicado por ID',
    description:
      'Obtiene el detalle público de un auditorio activo en estado PUBLICADO.',
  })
  @ApiOkResponse({
    description: 'Detalle público del auditorio.',
    type: AuditorioResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.auditoriosService.findOnePublic(id);
  }
}
