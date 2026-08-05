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
import { CreateMonumentoDto } from './dto/request/create-monumento.dto';
import { UpdateEstadoMonumentoDto } from './dto/request/update-estado-monumento.dto';
import { UpdateMonumentoDto } from './dto/request/update-monumento.dto';
import { MonumentoResponseDto } from './dto/response/monumento-response.dto';
import { MonumentosService } from './monumentos.service';

@ApiTags('Monumentos')
@Controller('monumentos')
export class MonumentosController {
  constructor(private readonly monumentosService: MonumentosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar un monumento',
    description:
      'Registra un nuevo monumento en estado BORRADOR y con auditoría inicial.',
  })
  @ApiCreatedResponse({
    description: 'Monumento registrado correctamente.',
    type: MonumentoResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un monumento activo registrado con ese nombre.',
  })
  create(
    @Body() createMonumentoDto: CreateMonumentoDto,
  ): Promise<ApiResponseDto<MonumentoResponseDto>> {
    return this.monumentosService.create(createMonumentoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar monumentos',
    description: 'Obtiene un listado paginado de monumentos activos.',
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
    example: 'Naya',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    example: 'ASC',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.monumentosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalle de un monumento',
    description:
      'Obtiene la información completa de un monumento activo por su identificador.',
  })
  @ApiOkResponse({
    description: 'Monumento encontrado correctamente.',
    type: MonumentoResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un monumento activo con el identificador indicado.',
  })
  findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MonumentoResponseDto> {
    return this.monumentosService.findById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un monumento',
    description: 'Actualiza la información de un monumento activo.',
  })
  @ApiOkResponse({
    description: 'Monumento actualizado correctamente.',
    type: MonumentoResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un monumento activo registrado con ese nombre.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un monumento activo con el identificador indicado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMonumentoDto: UpdateMonumentoDto,
  ): Promise<ApiResponseDto<MonumentoResponseDto>> {
    return this.monumentosService.update(id, updateMonumentoDto);
  }

  @Patch(':id/estado')
  @ApiOperation({
    summary: 'Actualizar estado de un monumento',
    description:
      'Actualiza el estado de un monumento a BORRADOR, PUBLICADO o INACTIVO.',
  })
  @ApiOkResponse({
    description: 'Estado del monumento actualizado correctamente.',
    type: MonumentoResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'El estado enviado no es válido.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un monumento activo con el identificador indicado.',
  })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateEstadoMonumentoDto: UpdateEstadoMonumentoDto,
  ): Promise<ApiResponseDto<MonumentoResponseDto>> {
    return this.monumentosService.updateEstado(id, updateEstadoMonumentoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar lógicamente un monumento',
    description:
      'Marca el monumento como eliminado y conserva el registro para auditoría.',
  })
  @ApiOkResponse({
    description: 'Monumento eliminado correctamente.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un monumento activo con el identificador indicado.',
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<null>> {
    return this.monumentosService.delete(id);
  }

  @Patch(':id/restaurar')
  @ApiOperation({
    summary: 'Restaurar un monumento eliminado',
    description:
      'Restaura un monumento eliminado lógicamente y lo vuelve a dejar activo.',
  })
  @ApiOkResponse({
    description: 'Monumento restaurado correctamente.',
    type: MonumentoResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un monumento eliminado con el identificador indicado.',
  })
  @ApiConflictResponse({
    description:
      'Ya existe un monumento activo registrado con el mismo nombre.',
  })
  restore(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<MonumentoResponseDto>> {
    return this.monumentosService.restore(id);
  }
}
