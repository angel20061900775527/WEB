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
    title: 'Conoce Zamora',
  },
  {
    path: 'nuevo',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
    loadComponent: () =>
      import('./pages/usuarios-create/usuarios-create').then((m) => m.UsuariosCreate),
    title: 'Conoce Zamora',
  },
  {
    path: ':id/editar',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
    loadComponent: () => import('./pages/usuarios-edit/usuarios-edit').then((m) => m.UsuariosEdit),
    title: 'Conoce Zamora',
  },
  {
    path: ':id/password',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR'],
    },
    loadComponent: () =>
      import('./pages/usuarios-password/usuarios-password').then((m) => m.UsuariosPassword),
    title: 'Conoce Zamora',
  },
];
