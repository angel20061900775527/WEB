import { Routes } from '@angular/router';

import { roleGuard } from '../../core/auth/role.guard';

export const MUSEOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/museos-list/museos-list').then((m) => m.MuseosList),
  },
  {
    path: 'nuevo',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () => import('./pages/museos-create/museos-create').then((m) => m.MuseosCreate),
  },
  {
    path: 'eliminados',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () =>
      import('./pages/museos-deleted/museos-deleted').then((m) => m.MuseosDeleted),
  },
  {
    path: ':id/editar',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () => import('./pages/museos-edit/museos-edit').then((m) => m.MuseosEdit),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/museos-detail/museos-detail').then((m) => m.MuseosDetail),
  },
];
