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
import { CreateMuseoDto } from './dto/request/create-museo.dto';
import { UpdateEstadoMuseoDto } from './dto/request/update-estado-museo.dto';
import { UpdateMuseoDto } from './dto/request/update-museo.dto';
import { MuseoResponseDto } from './dto/response/museo-response.dto';
import { MuseosService } from './museos.service';

@ApiTags('Museos')
@Controller('museos')
export class MuseosController {
  constructor(private readonly museosService: MuseosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar un museo',
    description:
      'Registra un nuevo museo en estado BORRADOR y con auditoría inicial.',
  })
  @ApiCreatedResponse({
    description: 'Museo registrado correctamente.',
    type: MuseoResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un museo activo registrado con ese nombre.',
  })
  create(
    @Body() createMuseoDto: CreateMuseoDto,
  ): Promise<ApiResponseDto<MuseoResponseDto>> {
    return this.museosService.create(createMuseoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar museos',
    description: 'Obtiene un listado paginado de museos activos.',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'search', required: false, example: 'municipal' })
  @ApiQuery({ name: 'order', required: false, example: 'ASC' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.museosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalle de un museo',
  })
  @ApiOkResponse({
    description: 'Museo encontrado correctamente.',
    type: MuseoResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un museo activo con el identificador indicado.',
  })
  findById(@Param('id', ParseIntPipe) id: number): Promise<MuseoResponseDto> {
    return this.museosService.findById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un museo',
  })
  @ApiOkResponse({
    description: 'Museo actualizado correctamente.',
    type: MuseoResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un museo activo registrado con ese nombre.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMuseoDto: UpdateMuseoDto,
  ): Promise<ApiResponseDto<MuseoResponseDto>> {
    return this.museosService.update(id, updateMuseoDto);
  }

  @Patch(':id/estado')
  @ApiOperation({
    summary: 'Actualizar estado de un museo',
  })
  @ApiOkResponse({
    description: 'Estado del museo actualizado correctamente.',
    type: MuseoResponseDto,
  })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstadoMuseoDto: UpdateEstadoMuseoDto,
  ): Promise<ApiResponseDto<MuseoResponseDto>> {
    return this.museosService.updateEstado(id, updateEstadoMuseoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar lógicamente un museo',
  })
  @ApiOkResponse({
    description: 'Museo eliminado correctamente.',
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<null>> {
    return this.museosService.delete(id);
  }

  @Patch(':id/restaurar')
  @ApiOperation({
    summary: 'Restaurar un museo eliminado',
  })
  @ApiOkResponse({
    description: 'Museo restaurado correctamente.',
    type: MuseoResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un museo eliminado con el identificador indicado.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un museo activo registrado con el mismo nombre.',
  })
  restore(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<MuseoResponseDto>> {
    return this.museosService.restore(id);
  }
}
