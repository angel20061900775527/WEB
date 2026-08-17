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
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { PaginationQueryDto } from '../../common/dto/request/pagination-query.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RolUsuario } from '../usuarios/enums/rol-usuario.enum';
import { CreateParqueDto } from './dto/request/create-parque.dto';
import { UpdateEstadoParqueDto } from './dto/request/update-estado-parque.dto';
import { UpdateParqueDto } from './dto/request/update-parque.dto';
import { ParqueResponseDto } from './dto/response/parque-response.dto';
import { ParquesService } from './parques.service';

interface AuthenticatedRequest {
  user: {
    id: number;
    username: string;
    rol: RolUsuario;
  };
}
@ApiTags('Parques')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('parques')
export class ParquesController {
  constructor(private readonly parquesService: ParquesService) {}

  @Post()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    return this.parquesService.create(createParqueDto, request.user.id);
  }

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
  @ApiOperation({
    summary: 'Listar parques',
    description: 'Obtiene un listado paginado de parques.',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.parquesService.findAll(query);
  }

  @Get('eliminados')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Listar parques eliminados',
    description:
      'Obtiene un listado paginado de parques eliminados lógicamente.',
  })
  @ApiOkResponse({
    description: 'Listado de parques eliminados.',
    type: ParqueResponseDto,
    isArray: true,
  })
  findDeleted(@Query() query: PaginationQueryDto) {
    return this.parquesService.findDeleted(query);
  }

  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
  @ApiOperation({
    summary: 'Obtener detalle de un parque',
    description:
      'Obtiene la información completa de un parque por su identificador.',
  })
  @ApiOkResponse({
    description: 'Parque encontrado correctamente.',
    type: ParqueResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un parque activo con el identificador indicado.',
  })
  findById(@Param('id', ParseIntPipe) id: number): Promise<ParqueResponseDto> {
    return this.parquesService.findById(id);
  }

  @Put(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
  @ApiNotFoundResponse({
    description:
      'No se encontró un parque activo con el identificador indicado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParqueDto: UpdateParqueDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    return this.parquesService.update(id, updateParqueDto, request.user.id);
  }

  @Patch(':id/estado')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
  @ApiNotFoundResponse({
    description:
      'No se encontró un parque activo con el identificador indicado.',
  })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateEstadoParqueDto: UpdateEstadoParqueDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    return this.parquesService.updateEstado(
      id,
      updateEstadoParqueDto,
      request.user.id,
    );
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<null>> {
    return this.parquesService.delete(id, request.user.id);
  }

  @Patch(':id/restaurar')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<ParqueResponseDto>> {
    return this.parquesService.restore(id, request.user.id);
  }
}
