import { Routes } from '@angular/router';

import { roleGuard } from '../../core/auth/role.guard';

export const MONUMENTOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/monumentos-list/monumentos-list').then(
        (component) => component.MonumentosList,
      ),
    title: 'Conoce Zamora',
  },
  {
    path: 'nuevo',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () =>
      import('./pages/monumentos-create/monumentos-create').then(
        (component) => component.MonumentosCreate,
      ),
    title: 'Conoce Zamora',
  },
  {
    path: 'eliminados',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () =>
      import('./pages/monumentos-deleted/monumentos-deleted').then(
        (component) => component.MonumentosDeleted,
      ),
    title: 'Conoce Zamora',
  },
  {
    path: ':id/editar',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () =>
      import('./pages/monumentos-edit/monumentos-edit').then(
        (component) => component.MonumentosEdit,
      ),
    title: 'Conoce Zamora',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/monumentos-detail/monumentos-detail').then(
        (component) => component.MonumentosDetail,
      ),
    title: 'Conoce Zamora',
  },
];
