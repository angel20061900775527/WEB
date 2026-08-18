import { Routes } from '@angular/router';

import { roleGuard } from '../../core/auth/role.guard';

export const USUARIOS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
    loadComponent: () => import('./pages/usuarios-list/usuarios-list').then((m) => m.UsuariosList),
    title: 'Usuarios | SIGPAC',
  },
  {
    path: 'nuevo',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
    loadComponent: () =>
      import('./pages/usuarios-create/usuarios-create').then((m) => m.UsuariosCreate),
    title: 'Nuevo usuario | SIGPAC',
  },
  {
    path: ':id/editar',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
    loadComponent: () => import('./pages/usuarios-edit/usuarios-edit').then((m) => m.UsuariosEdit),
    title: 'Editar usuario | SIGPAC',
  },
  {
    path: ':id/password',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
    loadComponent: () =>
      import('./pages/usuarios-password/usuarios-password').then((m) => m.UsuariosPassword),
    title: 'Restablecer contraseña | SIGPAC',
  },
];
