import { Routes } from '@angular/router';

export const AUDITORIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/auditorios-list/auditorios-list').then((m) => m.AuditoriosList),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/auditorios-create/auditorios-create').then((m) => m.AuditoriosCreate),
  },
  {
    path: 'eliminados',
    loadComponent: () =>
      import('./pages/auditorios-deleted/auditorios-deleted').then((m) => m.AuditoriosDeleted),
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/auditorios-edit/auditorios-edit').then((m) => m.AuditoriosEdit),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/auditorios-detail/auditorios-detail').then((m) => m.AuditoriosDetail),
  },
];
