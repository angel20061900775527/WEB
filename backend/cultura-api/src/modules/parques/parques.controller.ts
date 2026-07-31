import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { CreateParqueDto } from './dto/request/create-parque.dto';
import { ParqueResponseDto } from './dto/response/parque-response.dto';
import { ParquesService } from './parques.service';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';

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
}
