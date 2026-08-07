import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { CreatePlazaDto } from './dto/request/create-plaza.dto';
import { UpdateEstadoPlazaDto } from './dto/request/update-estado-plaza.dto';
import { UpdatePlazaDto } from './dto/request/update-plaza.dto';
import { PlazaResponseDto } from './dto/response/plaza-response.dto';
import { PlazasService } from './plazas.service';

@ApiTags('Plazas')
@Controller('plazas')
export class PlazasController {
  constructor(private readonly plazasService: PlazasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar una plaza',
    description:
      'Registra una nueva plaza en estado BORRADOR y con auditoría inicial.',
  })
  @ApiCreatedResponse({
    description: 'Plaza registrada correctamente.',
    type: PlazaResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe una plaza activa registrada con ese nombre.',
  })
  create(
    @Body() createPlazaDto: CreatePlazaDto,
  ): Promise<ApiResponseDto<PlazaResponseDto>> {
    return this.plazasService.create(createPlazaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar plazas',
    description: 'Obtiene un listado paginado de plazas activas.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'central' })
  @ApiQuery({ name: 'order', required: false, example: 'ASC' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.plazasService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalle de una plaza',
  })
  @ApiOkResponse({
    description: 'Plaza encontrada correctamente.',
    type: PlazaResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró una plaza activa con el identificador indicado.',
  })
  findById(@Param('id', ParseIntPipe) id: number): Promise<PlazaResponseDto> {
    return this.plazasService.findById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar una plaza',
  })
  @ApiOkResponse({
    description: 'Plaza actualizada correctamente.',
    type: PlazaResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe una plaza activa registrada con ese nombre.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlazaDto: UpdatePlazaDto,
  ): Promise<ApiResponseDto<PlazaResponseDto>> {
    return this.plazasService.update(id, updatePlazaDto);
  }

  @Patch(':id/estado')
  @ApiOperation({
    summary: 'Actualizar estado de una plaza',
  })
  @ApiOkResponse({
    description: 'Estado de la plaza actualizado correctamente.',
    type: PlazaResponseDto,
  })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstadoPlazaDto: UpdateEstadoPlazaDto,
  ): Promise<ApiResponseDto<PlazaResponseDto>> {
    return this.plazasService.updateEstado(id, updateEstadoPlazaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar lógicamente una plaza',
  })
  @ApiOkResponse({
    description: 'Plaza eliminada correctamente.',
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<null>> {
    return this.plazasService.delete(id);
  }

  @Patch(':id/restaurar')
  @ApiOperation({
    summary: 'Restaurar una plaza eliminada',
  })
  @ApiOkResponse({
    description: 'Plaza restaurada correctamente.',
    type: PlazaResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró una plaza eliminada con el identificador indicado.',
  })
  @ApiConflictResponse({
    description: 'Ya existe una plaza activa registrada con el mismo nombre.',
  })
  restore(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<PlazaResponseDto>> {
    return this.plazasService.restore(id);
  }
}
