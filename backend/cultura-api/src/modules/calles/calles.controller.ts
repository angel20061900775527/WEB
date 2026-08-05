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
import { CallesService } from './calles.service';
import { CreateCalleDto } from './dto/request/create-calle.dto';
import { UpdateCalleDto } from './dto/request/update-calle.dto';
import { UpdateEstadoCalleDto } from './dto/request/update-estado-calle.dto';
import { CalleResponseDto } from './dto/response/calle-response.dto';

@ApiTags('Calles')
@Controller('calles')
export class CallesController {
  constructor(private readonly callesService: CallesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar una calle',
    description:
      'Registra una nueva calle en estado BORRADOR y con auditoría inicial.',
  })
  @ApiCreatedResponse({
    description: 'Calle registrada correctamente.',
    type: CalleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe una calle activa registrada con ese nombre.',
  })
  create(
    @Body() createCalleDto: CreateCalleDto,
  ): Promise<ApiResponseDto<CalleResponseDto>> {
    return this.callesService.create(createCalleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar calles',
    description: 'Obtiene un listado paginado de calles activas.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'Sevilla',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    example: 'ASC',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.callesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalle de una calle',
    description:
      'Obtiene la información completa de una calle activa por su identificador.',
  })
  @ApiOkResponse({
    description: 'Calle encontrada correctamente.',
    type: CalleResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró una calle activa con el identificador indicado.',
  })
  findById(@Param('id', ParseIntPipe) id: number): Promise<CalleResponseDto> {
    return this.callesService.findById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar una calle',
    description: 'Actualiza la información de una calle activa.',
  })
  @ApiOkResponse({
    description: 'Calle actualizada correctamente.',
    type: CalleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe una calle activa registrada con ese nombre.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró una calle activa con el identificador indicado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCalleDto: UpdateCalleDto,
  ): Promise<ApiResponseDto<CalleResponseDto>> {
    return this.callesService.update(id, updateCalleDto);
  }

  @Patch(':id/estado')
  @ApiOperation({
    summary: 'Actualizar estado de una calle',
    description:
      'Actualiza el estado de una calle a BORRADOR, PUBLICADO o INACTIVO.',
  })
  @ApiOkResponse({
    description: 'Estado de la calle actualizado correctamente.',
    type: CalleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'El estado enviado no es válido.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró una calle activa con el identificador indicado.',
  })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstadoCalleDto: UpdateEstadoCalleDto,
  ): Promise<ApiResponseDto<CalleResponseDto>> {
    return this.callesService.updateEstado(id, updateEstadoCalleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar lógicamente una calle',
    description:
      'Marca la calle como eliminada y conserva el registro para auditoría.',
  })
  @ApiOkResponse({
    description: 'Calle eliminada correctamente.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró una calle activa con el identificador indicado.',
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<null>> {
    return this.callesService.delete(id);
  }

  @Patch(':id/restaurar')
  @ApiOperation({
    summary: 'Restaurar una calle eliminada',
    description:
      'Restaura una calle eliminada lógicamente y la vuelve a dejar activa.',
  })
  @ApiOkResponse({
    description: 'Calle restaurada correctamente.',
    type: CalleResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró una calle eliminada con el identificador indicado.',
  })
  @ApiConflictResponse({
    description: 'Ya existe una calle activa registrada con el mismo nombre.',
  })
  restore(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<CalleResponseDto>> {
    return this.callesService.restore(id);
  }
}
