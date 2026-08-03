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
import { CreateParqueDto } from './dto/request/create-parque.dto';
import { UpdateParqueDto } from './dto/request/update-parque.dto';
import { ParqueResponseDto } from './dto/response/parque-response.dto';
import { ParquesService } from './parques.service';
import { UpdateEstadoParqueDto } from './dto/request/update-estado-parque.dto';

@ApiTags('Parques')
@Controller('parques')
export class ParquesController {
  constructor(private readonly parquesService: ParquesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar un parque',
    description:
      'Registra un nuevo parque en estado BORRADOR y con auditoría inicial.',
  })
  @ApiCreatedResponse({
    description: 'Parque registrado correctamente.',
    type: ParqueResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un parque registrado con ese nombre.',
  })
  create(
    @Body() createParqueDto: CreateParqueDto,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    return this.parquesService.create(createParqueDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar parques',
    description: 'Obtiene un listado paginado de parques.',
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
    example: 'central',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    example: 'ASC',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.parquesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalle de un parque',
    description:
      'Obtiene la información completa de un parque por su identificador.',
  })
  findById(@Param('id', ParseIntPipe) id: number): Promise<ParqueResponseDto> {
    return this.parquesService.findById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un parque',
    description: 'Actualiza la información de un parque existente.',
  })
  @ApiOkResponse({
    description: 'Parque actualizado correctamente.',
    type: ParqueResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un parque registrado con ese nombre.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParqueDto: UpdateParqueDto,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    return this.parquesService.update(id, updateParqueDto);
  }
  @Patch(':id/estado')
  @ApiOperation({
    summary: 'Actualizar estado de un parque',
    description:
      'Actualiza el estado de un parque (BORRADOR, PUBLICADO o INACTIVO).',
  })
  @ApiOkResponse({
    description: 'Estado del parque actualizado correctamente.',
    type: ParqueResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstadoParqueDto: UpdateEstadoParqueDto,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    return this.parquesService.updateEstado(id, updateEstadoParqueDto);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar lógicamente un parque',
    description:
      'Marca el parque como eliminado y conserva el registro para fines de auditoría.',
  })
  @ApiOkResponse({
    description: 'Parque eliminado correctamente.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un parque activo con el identificador indicado.',
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<null>> {
    return this.parquesService.delete(id);
  }
  @Patch(':id/restaurar')
  @ApiOperation({
    summary: 'Restaurar un parque eliminado',
    description:
      'Restaura un parque eliminado lógicamente y lo vuelve a dejar activo.',
  })
  @ApiOkResponse({
    description: 'Parque restaurado correctamente.',
    type: ParqueResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un parque eliminado con el identificador indicado.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un parque activo registrado con el mismo nombre.',
  })
  restore(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    return this.parquesService.restore(id);
  }
}
