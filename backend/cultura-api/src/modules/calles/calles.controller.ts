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
import { CallesService } from './calles.service';
import { CreateCalleDto } from './dto/request/create-calle.dto';
import { UpdateCalleDto } from './dto/request/update-calle.dto';
import { UpdateEstadoCalleDto } from './dto/request/update-estado-calle.dto';
import { CalleResponseDto } from './dto/response/calle-response.dto';

interface AuthenticatedRequest {
  user: {
    id: number;
    username: string;
    rol: RolUsuario;
  };
}
@ApiTags('Calles')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('calles')
export class CallesController {
  constructor(private readonly callesService: CallesService) {}

  @Post()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<CalleResponseDto>> {
    return this.callesService.create(createCalleDto, request.user.id);
  }

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
  @ApiOperation({
    summary: 'Listar calles',
    description: 'Obtiene un listado paginado de calles activas.',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.callesService.findAll(query);
  }

  @Get('eliminados')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Listar calles eliminadas',
    description:
      'Obtiene un listado paginado de calles eliminadas lógicamente.',
  })
  @ApiOkResponse({
    description: 'Listado de calles eliminadas.',
    type: CalleResponseDto,
    isArray: true,
  })
  findDeleted(@Query() query: PaginationQueryDto) {
    return this.callesService.findDeleted(query);
  }

  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
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
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<CalleResponseDto>> {
    return this.callesService.update(id, updateCalleDto, request.user.id);
  }

  @Patch(':id/estado')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
    @Body()
    updateEstadoCalleDto: UpdateEstadoCalleDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<CalleResponseDto>> {
    return this.callesService.updateEstado(
      id,
      updateEstadoCalleDto,
      request.user.id,
    );
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<null>> {
    return this.callesService.delete(id, request.user.id);
  }

  @Patch(':id/restaurar')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<CalleResponseDto>> {
    return this.callesService.restore(id, request.user.id);
  }
}
