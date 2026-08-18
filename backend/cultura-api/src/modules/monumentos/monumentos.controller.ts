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
import { CreateMonumentoDto } from './dto/request/create-monumento.dto';
import { UpdateEstadoMonumentoDto } from './dto/request/update-estado-monumento.dto';
import { UpdateMonumentoDto } from './dto/request/update-monumento.dto';
import { MonumentoResponseDto } from './dto/response/monumento-response.dto';
import { MonumentosService } from './monumentos.service';

interface AuthenticatedRequest {
  user: {
    id: number;
    username: string;
    rol: RolUsuario;
  };
}
@ApiTags('Monumentos')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('monumentos')
export class MonumentosController {
  constructor(private readonly monumentosService: MonumentosService) {}

  @Post()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<MonumentoResponseDto>> {
    return this.monumentosService.create(createMonumentoDto, request.user.id);
  }

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
  @ApiOperation({
    summary: 'Listar monumentos',
    description: 'Obtiene un listado paginado de monumentos activos.',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.monumentosService.findAll(query);
  }

  @Get('eliminados')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Listar monumentos eliminados',
    description:
      'Obtiene un listado paginado de monumentos eliminados lógicamente.',
  })
  @ApiOkResponse({
    description: 'Listado de monumentos eliminados.',
    type: MonumentoResponseDto,
    isArray: true,
  })
  findDeleted(@Query() query: PaginationQueryDto) {
    return this.monumentosService.findDeleted(query);
  }

  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
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
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<MonumentoResponseDto>> {
    return this.monumentosService.update(
      id,
      updateMonumentoDto,
      request.user.id,
    );
  }

  @Patch(':id/estado')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<MonumentoResponseDto>> {
    return this.monumentosService.updateEstado(
      id,
      updateEstadoMonumentoDto,
      request.user.id,
    );
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<null>> {
    return this.monumentosService.delete(id, request.user.id);
  }

  @Patch(':id/restaurar')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
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
    @Req() request: AuthenticatedRequest,
  ): Promise<ApiResponseDto<MonumentoResponseDto>> {
    return this.monumentosService.restore(id, request.user.id);
  }
}
