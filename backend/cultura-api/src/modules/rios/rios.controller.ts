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
import { CreateRioDto } from './dto/request/create-rio.dto';
import { UpdateEstadoRioDto } from './dto/request/update-estado-rio.dto';
import { UpdateRioDto } from './dto/request/update-rio.dto';
import { RioResponseDto } from './dto/response/rio-response.dto';
import { RiosService } from './rios.service';

@ApiTags('Ríos')
@Controller('rios')
export class RiosController {
  constructor(private readonly riosService: RiosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar un río',
    description:
      'Registra un nuevo río en estado BORRADOR y con auditoría inicial.',
  })
  @ApiCreatedResponse({
    description: 'Río registrado correctamente.',
    type: RioResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un río activo registrado con ese nombre.',
  })
  create(
    @Body() createRioDto: CreateRioDto,
  ): Promise<ApiResponseDto<RioResponseDto>> {
    return this.riosService.create(createRioDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar ríos',
    description: 'Obtiene un listado paginado de ríos activos.',
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
    example: 'Zamora',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    example: 'ASC',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.riosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalle de un río',
    description:
      'Obtiene la información completa de un río activo por su identificador.',
  })
  @ApiOkResponse({
    description: 'Río encontrado correctamente.',
    type: RioResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró un río activo con el identificador indicado.',
  })
  findById(@Param('id', ParseIntPipe) id: number): Promise<RioResponseDto> {
    return this.riosService.findById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un río',
    description: 'Actualiza la información de un río activo.',
  })
  @ApiOkResponse({
    description: 'Río actualizado correctamente.',
    type: RioResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un río activo registrado con ese nombre.',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró un río activo con el identificador indicado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRioDto: UpdateRioDto,
  ): Promise<ApiResponseDto<RioResponseDto>> {
    return this.riosService.update(id, updateRioDto);
  }

  @Patch(':id/estado')
  @ApiOperation({
    summary: 'Actualizar estado de un río',
    description:
      'Actualiza el estado de un río a BORRADOR, PUBLICADO o INACTIVO.',
  })
  @ApiOkResponse({
    description: 'Estado del río actualizado correctamente.',
    type: RioResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'El estado enviado no es válido.',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró un río activo con el identificador indicado.',
  })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstadoRioDto: UpdateEstadoRioDto,
  ): Promise<ApiResponseDto<RioResponseDto>> {
    return this.riosService.updateEstado(id, updateEstadoRioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar lógicamente un río',
    description:
      'Marca el río como eliminado y conserva el registro para auditoría.',
  })
  @ApiOkResponse({
    description: 'Río eliminado correctamente.',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró un río activo con el identificador indicado.',
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<null>> {
    return this.riosService.delete(id);
  }

  @Patch(':id/restaurar')
  @ApiOperation({
    summary: 'Restaurar un río eliminado',
    description:
      'Restaura un río eliminado lógicamente y lo vuelve a dejar activo.',
  })
  @ApiOkResponse({
    description: 'Río restaurado correctamente.',
    type: RioResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un río eliminado con el identificador indicado.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un río activo registrado con el mismo nombre.',
  })
  restore(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<RioResponseDto>> {
    return this.riosService.restore(id);
  }
}
