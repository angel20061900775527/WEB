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
import { CreatePlazaDto } from './dto/request/create-plaza.dto';
import { UpdateEstadoPlazaDto } from './dto/request/update-estado-plaza.dto';
import { UpdatePlazaDto } from './dto/request/update-plaza.dto';
import { PlazaResponseDto } from './dto/response/plaza-response.dto';
import { PlazasService } from './plazas.service';

@ApiTags('Plazas')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('plazas')
export class PlazasController {
  constructor(private readonly plazasService: PlazasService) {}

  @Post()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar una plaza',
    description:
      'Registra una nueva plaza en estado BORRADOR y con auditoría inicial.',
  })
  @ApiCreatedResponse({
    description: 'Plaza registrada correctamente.',
    type: PlazaResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe una plaza activa registrada con ese nombre.',
  })
  create(
    @Body() createPlazaDto: CreatePlazaDto,
  ): Promise<ApiResponseDto<PlazaResponseDto>> {
    return this.plazasService.create(createPlazaDto);
  }

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
  @ApiOperation({
    summary: 'Listar plazas',
    description: 'Obtiene un listado paginado de plazas activas.',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.plazasService.findAll(query);
  }

  @Get('eliminados')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Listar plazas eliminadas',
    description:
      'Obtiene un listado paginado de plazas eliminadas lógicamente.',
  })
  @ApiOkResponse({
    description: 'Listado de plazas eliminadas.',
    type: PlazaResponseDto,
    isArray: true,
  })
  findDeleted(@Query() query: PaginationQueryDto) {
    return this.plazasService.findDeleted(query);
  }

  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
  @ApiOperation({
    summary: 'Obtener detalle de una plaza',
    description:
      'Obtiene la información completa de una plaza activa por su identificador.',
  })
  @ApiOkResponse({
    description: 'Plaza encontrada correctamente.',
    type: PlazaResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró una plaza activa con el identificador indicado.',
  })
  findById(@Param('id', ParseIntPipe) id: number): Promise<PlazaResponseDto> {
    return this.plazasService.findById(id);
  }

  @Put(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Actualizar una plaza',
    description: 'Actualiza la información de una plaza activa.',
  })
  @ApiOkResponse({
    description: 'Plaza actualizada correctamente.',
    type: PlazaResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe una plaza activa registrada con ese nombre.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró una plaza activa con el identificador indicado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlazaDto: UpdatePlazaDto,
  ): Promise<ApiResponseDto<PlazaResponseDto>> {
    return this.plazasService.update(id, updatePlazaDto);
  }

  @Patch(':id/estado')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Actualizar estado de una plaza',
    description:
      'Actualiza el estado de una plaza a BORRADOR, PUBLICADO o INACTIVO.',
  })
  @ApiOkResponse({
    description: 'Estado de la plaza actualizado correctamente.',
    type: PlazaResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'El estado enviado no es válido.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró una plaza activa con el identificador indicado.',
  })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateEstadoPlazaDto: UpdateEstadoPlazaDto,
  ): Promise<ApiResponseDto<PlazaResponseDto>> {
    return this.plazasService.updateEstado(id, updateEstadoPlazaDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar lógicamente una plaza',
    description:
      'Marca la plaza como eliminada y conserva el registro para auditoría.',
  })
  @ApiOkResponse({
    description: 'Plaza eliminada correctamente.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró una plaza activa con el identificador indicado.',
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<null>> {
    return this.plazasService.delete(id);
  }

  @Patch(':id/restaurar')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Restaurar una plaza eliminada',
    description:
      'Restaura una plaza eliminada lógicamente y la vuelve a dejar activa.',
  })
  @ApiOkResponse({
    description: 'Plaza restaurada correctamente.',
    type: PlazaResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró una plaza eliminada con el identificador indicado.',
  })
  @ApiConflictResponse({
    description: 'Ya existe una plaza activa registrada con el mismo nombre.',
  })
  restore(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<PlazaResponseDto>> {
    return this.plazasService.restore(id);
  }
}
