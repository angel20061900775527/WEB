import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { AuthService, RolUsuario } from './auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const rolesPermitidos = route.data['roles'] as RolUsuario[] | undefined;

  const rolActual = authService.rol();

  if (rolesPermitidos && rolActual && rolesPermitidos.includes(rolActual)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
