import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { RolUsuario } from '../usuarios/enums/rol-usuario.enum';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: {
    id: number;
    username: string;
    nombres: string;
    apellidos: string;
    email: string;
    rol: string;
  };
}

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Valida las credenciales del usuario y genera un token JWT.',
  })
  @ApiOkResponse({
    description: 'Inicio de sesión correcto.',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuario o contraseña incorrectos.',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.CULTURA, RolUsuario.CONSULTA)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description: 'Devuelve la información del usuario asociada al token JWT.',
  })
  @ApiOkResponse({
    description: 'Perfil obtenido correctamente.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inexistente, inválido o expirado.',
  })
  perfil(@Req() request: AuthenticatedRequest): AuthenticatedRequest['user'] {
    return request.user;
  }
  @Get('solo-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Prueba de acceso exclusivo para administrador',
  })
  @ApiOkResponse({
    description: 'Acceso autorizado.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token inexistente, inválido o expirado.',
  })
  soloAdmin() {
    return {
      message: 'Acceso autorizado para administrador.',
    };
  }
}
