import { Routes } from '@angular/router';

import { roleGuard } from '../../core/auth/role.guard';

export const RIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/rios-list/rios-list').then((component) => component.RiosList),
    title: 'Conoce Zamora',
  },
  {
    path: 'nuevo',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () =>
      import('./pages/rios-create/rios-create').then((component) => component.RiosCreate),
    title: 'Conoce Zamora',
  },
  {
    path: 'eliminados',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () =>
      import('./pages/rios-deleted/rios-deleted').then((component) => component.RiosDeleted),
    title: 'Conoce Zamora',
  },
  {
    path: ':id/editar',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () =>
      import('./pages/rios-edit/rios-edit').then((component) => component.RiosEdit),
    title: 'Conoce Zamora',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/rios-detail/rios-detail').then((component) => component.RiosDetail),
    title: 'Conoce Zamora',
  },
];
