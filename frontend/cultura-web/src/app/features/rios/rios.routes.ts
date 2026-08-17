import { Routes } from '@angular/router';

export const RIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/rios-list/rios-list').then((component) => component.RiosList),
    title: 'Ríos | SIGPAC',
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/rios-create/rios-create').then((component) => component.RiosCreate),
    title: 'Nuevo río | SIGPAC',
  },
  {
    path: 'eliminados',
    loadComponent: () =>
      import('./pages/rios-deleted/rios-deleted').then((component) => component.RiosDeleted),
    title: 'Ríos eliminados | SIGPAC',
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/rios-edit/rios-edit').then((component) => component.RiosEdit),
    title: 'Editar río | SIGPAC',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/rios-detail/rios-detail').then((component) => component.RiosDetail),
    title: 'Detalle del río | SIGPAC',
  },
];
