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
import { CreateMuseoDto } from './dto/request/create-museo.dto';
import { UpdateEstadoMuseoDto } from './dto/request/update-estado-museo.dto';
import { UpdateMuseoDto } from './dto/request/update-museo.dto';
import { MuseoResponseDto } from './dto/response/museo-response.dto';
import { MuseosService } from './museos.service';

@ApiTags('Museos')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('museos')
export class MuseosController {
  constructor(private readonly museosService: MuseosService) {}

  @Post()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar un museo',
    description:
      'Registra un nuevo museo en estado BORRADOR y con auditoría inicial.',
  })
  @ApiCreatedResponse({
    description: 'Museo registrado correctamente.',
    type: MuseoResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un museo activo registrado con ese nombre.',
  })
  create(
    @Body() createMuseoDto: CreateMuseoDto,
  ): Promise<ApiResponseDto<MuseoResponseDto>> {
    return this.museosService.create(createMuseoDto);
  }

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
  @ApiOperation({
    summary: 'Listar museos',
    description: 'Obtiene un listado paginado de museos activos.',
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.museosService.findAll(query);
  }

  @Get('eliminados')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Listar museos eliminados',
    description:
      'Obtiene un listado paginado de museos eliminados lógicamente.',
  })
  @ApiOkResponse({
    description: 'Listado de museos eliminados.',
    type: MuseoResponseDto,
    isArray: true,
  })
  findDeleted(@Query() query: PaginationQueryDto) {
    return this.museosService.findDeleted(query);
  }

  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
  @ApiOperation({
    summary: 'Obtener detalle de un museo',
    description:
      'Obtiene la información completa de un museo activo por su identificador.',
  })
  @ApiOkResponse({
    description: 'Museo encontrado correctamente.',
    type: MuseoResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un museo activo con el identificador indicado.',
  })
  findById(@Param('id', ParseIntPipe) id: number): Promise<MuseoResponseDto> {
    return this.museosService.findById(id);
  }

  @Put(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Actualizar un museo',
    description: 'Actualiza la información de un museo activo.',
  })
  @ApiOkResponse({
    description: 'Museo actualizado correctamente.',
    type: MuseoResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un museo activo registrado con ese nombre.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un museo activo con el identificador indicado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMuseoDto: UpdateMuseoDto,
  ): Promise<ApiResponseDto<MuseoResponseDto>> {
    return this.museosService.update(id, updateMuseoDto);
  }

  @Patch(':id/estado')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Actualizar estado de un museo',
    description:
      'Actualiza el estado de un museo a BORRADOR, PUBLICADO o INACTIVO.',
  })
  @ApiOkResponse({
    description: 'Estado del museo actualizado correctamente.',
    type: MuseoResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'El estado enviado no es válido.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un museo activo con el identificador indicado.',
  })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateEstadoMuseoDto: UpdateEstadoMuseoDto,
  ): Promise<ApiResponseDto<MuseoResponseDto>> {
    return this.museosService.updateEstado(id, updateEstadoMuseoDto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar lógicamente un museo',
    description:
      'Marca el museo como eliminado y conserva el registro para auditoría.',
  })
  @ApiOkResponse({
    description: 'Museo eliminado correctamente.',
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un museo activo con el identificador indicado.',
  })
  delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseDto<null>> {
    return this.museosService.delete(id);
  }

  @Patch(':id/restaurar')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA)
  @ApiOperation({
    summary: 'Restaurar un museo eliminado',
    description:
      'Restaura un museo eliminado lógicamente y lo vuelve a dejar activo.',
  })
  @ApiOkResponse({
    description: 'Museo restaurado correctamente.',
    type: MuseoResponseDto,
  })
  @ApiNotFoundResponse({
    description:
      'No se encontró un museo eliminado con el identificador indicado.',
  })
  @ApiConflictResponse({
    description: 'Ya existe un museo activo registrado con el mismo nombre.',
  })
  restore(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<MuseoResponseDto>> {
    return this.museosService.restore(id);
  }
}
