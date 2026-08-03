import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
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
}
