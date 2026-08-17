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
import { AuditoriosService } from './auditorios.service';
import { CreateAuditorioDto } from './dto/request/create-auditorio.dto';
import { UpdateAuditorioDto } from './dto/request/update-auditorio.dto';
import { UpdateEstadoAuditorioDto } from './dto/request/update-estado-auditorio.dto';
import { AuditorioResponseDto } from './dto/response/auditorio-response.dto';

@ApiTags('Auditorios')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('auditorios')
export class AuditoriosController {
  constructor(private readonly auditoriosService: AuditoriosService) {}

  @Post()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar un auditorio',
    description:
      'Registra un nuevo auditorio en estado BORRADOR y con auditoría inicial.',
  })
  @ApiCreatedResponse({
    description: 'Auditorio registrado correctamente.',
    type: AuditorioResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un auditorio activo registrado con ese nombre.',
  })
  create(
    @Body() createAuditorioDto: CreateAuditorioDto,
  ): Promise<ApiResponseDto<AuditorioResponseDto>> {
    return this.auditoriosService.create(createAuditorioDto);
  }

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
  @ApiOperation({
    summary: 'Listar auditorios',
    description: 'Obtiene un listado paginado de auditorios activos.',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.auditoriosService.findAll(query);
  }

  @Get('eliminados')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Listar auditorios eliminados',
    description:
      'Obtiene un listado paginado de auditorios eliminados lógicamente.',
  })
  @ApiOkResponse({
    description: 'Listado de auditorios eliminados.',
    type: AuditorioResponseDto,
    isArray: true,
  })
  findDeleted(@Query() query: PaginationQueryDto) {
    return this.auditoriosService.findDeleted(query);
  }

  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
  @ApiOperation({
    summary: 'Obtener detalle de un auditorio',
    description:
      'Obtiene la información completa de un auditorio activo por su identificador.',
  })
  @ApiOkResponse({
    description: 'Auditorio encontrado correctamente.',
    type: AuditorioResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un auditorio activo con el identificador indicado.',
  })
  findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuditorioResponseDto> {
    return this.auditoriosService.findById(id);
  }

  @Put(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Actualizar un auditorio',
    description: 'Actualiza la información de un auditorio activo.',
  })
  @ApiOkResponse({
    description: 'Auditorio actualizado correctamente.',
    type: AuditorioResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un auditorio activo registrado con ese nombre.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un auditorio activo con el identificador indicado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuditorioDto: UpdateAuditorioDto,
  ): Promise<ApiResponseDto<AuditorioResponseDto>> {
    return this.auditoriosService.update(id, updateAuditorioDto);
  }

  @Patch(':id/estado')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Actualizar estado de un auditorio',
    description:
      'Actualiza el estado de un auditorio a BORRADOR, PUBLICADO o INACTIVO.',
  })
  @ApiOkResponse({
    description: 'Estado del auditorio actualizado correctamente.',
    type: AuditorioResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'El estado enviado no es válido.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un auditorio activo con el identificador indicado.',
  })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateEstadoAuditorioDto: UpdateEstadoAuditorioDto,
  ): Promise<ApiResponseDto<AuditorioResponseDto>> {
    return this.auditoriosService.updateEstado(id, updateEstadoAuditorioDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar lógicamente un auditorio',
    description:
      'Marca el auditorio como eliminado y conserva el registro para auditoría.',
  })
  @ApiOkResponse({
    description: 'Auditorio eliminado correctamente.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un auditorio activo con el identificador indicado.',
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<null>> {
    return this.auditoriosService.delete(id);
  }

  @Patch(':id/restaurar')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Restaurar un auditorio eliminado',
    description:
      'Restaura un auditorio eliminado lógicamente y lo vuelve a dejar activo.',
  })
  @ApiOkResponse({
    description: 'Auditorio restaurado correctamente.',
    type: AuditorioResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un auditorio eliminado con el identificador indicado.',
  })
  @ApiConflictResponse({
    description:
      'Ya existe un auditorio activo registrado con el mismo nombre.',
  })
  restore(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<AuditorioResponseDto>> {
    return this.auditoriosService.restore(id);
  }
}
