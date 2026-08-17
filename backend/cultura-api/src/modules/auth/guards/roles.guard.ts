import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolUsuario } from '../../usuarios/enums/rol-usuario.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface AuthenticatedUser {
  id: number;
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  rol: RolUsuario;
}

interface AuthenticatedRequest {
  user?: AuthenticatedUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesPermitidos = this.reflector.getAllAndOverride<RolUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!rolesPermitidos || rolesPermitidos.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const usuario = request.user;

    if (!usuario) {
      return false;
    }

    return rolesPermitidos.includes(usuario.rol);
  }
}
