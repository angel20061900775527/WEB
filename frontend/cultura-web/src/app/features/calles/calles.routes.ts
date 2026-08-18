import { Routes } from '@angular/router';

import { roleGuard } from '../../core/auth/role.guard';

export const CALLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/calles-list/calles-list').then((component) => component.CallesList),
    title: 'Calles | SIGPAC',
  },
  {
    path: 'nuevo',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () =>
      import('./pages/calles-create/calles-create').then((component) => component.CallesCreate),
    title: 'Nueva calle | SIGPAC',
  },
  {
    path: 'eliminados',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () =>
      import('./pages/calles-deleted/calles-deleted').then((component) => component.CallesDeleted),
    title: 'Calles eliminadas | SIGPAC',
  },
  {
    path: ':id/editar',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () =>
      import('./pages/calles-edit/calles-edit').then((component) => component.CallesEdit),
    title: 'Editar calle | SIGPAC',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/calles-detail/calles-detail').then((component) => component.CallesDetail),
    title: 'Detalle de calle | SIGPAC',
  },
];
