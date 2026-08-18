import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ChangePasswordDto } from './dto/request/change-password.dto';
import { CreateUsuarioDto } from './dto/request/create-usuario.dto';
import { UpdateEstadoUsuarioDto } from './dto/request/update-estado-usuario.dto';
import { UpdateUsuarioDto } from './dto/request/update-usuario.dto';
import { UsuarioResponseDto } from './dto/response/usuario-response.dto';
import { RolUsuario } from './enums/rol-usuario.enum';
import { UsuariosService } from './usuarios.service';

interface AuthenticatedRequest {
  user: {
    id: number | string;
    username: string;
    rol: RolUsuario;
  };
}
@ApiTags('Usuarios')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMINISTRADOR)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar usuarios',
    description:
      'Obtiene el listado de usuarios registrados. Permite búsqueda por usuario, nombres, apellidos o correo.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'cultura',
  })
  @ApiOkResponse({
    description: 'Listado de usuarios.',
    type: UsuarioResponseDto,
    isArray: true,
  })
  findAll(@Query('search') search = ''): Promise<UsuarioResponseDto[]> {
    return this.usuariosService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por id',
  })
  @ApiOkResponse({
    description: 'Usuario encontrado correctamente.',
    type: UsuarioResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró el usuario indicado.',
  })
  findById(@Param('id', ParseIntPipe) id: number): Promise<UsuarioResponseDto> {
    return this.usuariosService.findAdminById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear usuario',
  })
  @ApiCreatedResponse({
    description: 'Usuario creado correctamente.',
    type: UsuarioResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description:
      'El nombre de usuario o correo electrónico ya se encuentra registrado.',
  })
  create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<UsuarioResponseDto> {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar usuario',
  })
  @ApiOkResponse({
    description: 'Usuario actualizado correctamente.',
    type: UsuarioResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no cumplen las reglas de validación.',
  })
  @ApiConflictResponse({
    description:
      'El nombre de usuario o correo electrónico ya se encuentra registrado.',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró el usuario indicado.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<UsuarioResponseDto> {
    return this.usuariosService.update(id, updateUsuarioDto, request.user.id);
  }

  @Patch(':id/estado')
  @ApiOperation({
    summary: 'Activar o desactivar usuario',
  })
  @ApiOkResponse({
    description: 'Estado del usuario actualizado correctamente.',
    type: UsuarioResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró el usuario indicado.',
  })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateEstadoUsuarioDto: UpdateEstadoUsuarioDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<UsuarioResponseDto> {
    return this.usuariosService.updateEstado(
      id,
      updateEstadoUsuarioDto,
      request.user.id,
    );
  }

  @Patch(':id/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Restablecer contraseña de usuario',
  })
  @ApiOkResponse({
    description: 'Contraseña actualizada correctamente.',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró el usuario indicado.',
  })
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    await this.usuariosService.changePassword(id, changePasswordDto);
  }
}
