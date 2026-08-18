import { Routes } from '@angular/router';

import { roleGuard } from '../../core/auth/role.guard';

export const AUDITORIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/auditorios-list/auditorios-list').then((m) => m.AuditoriosList),
  },
  {
    path: 'nuevo',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () =>
      import('./pages/auditorios-create/auditorios-create').then((m) => m.AuditoriosCreate),
  },
  {
    path: 'eliminados',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () =>
      import('./pages/auditorios-deleted/auditorios-deleted').then((m) => m.AuditoriosDeleted),
  },
  {
    path: ':id/editar',
    canActivate: [roleGuard],
    data: {
      roles: ['ADMINISTRADOR', 'CULTURA'],
    },
    loadComponent: () =>
      import('./pages/auditorios-edit/auditorios-edit').then((m) => m.AuditoriosEdit),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/auditorios-detail/auditorios-detail').then((m) => m.AuditoriosDetail),
  },
];
