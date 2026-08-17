import { Routes } from '@angular/router';

export const MONUMENTOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/monumentos-list/monumentos-list').then(
        (component) => component.MonumentosList,
      ),
    title: 'Monumentos | SIGPAC',
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/monumentos-create/monumentos-create').then(
        (component) => component.MonumentosCreate,
      ),
    title: 'Nuevo monumento | SIGPAC',
  },
  {
    path: 'eliminados',
    loadComponent: () =>
      import('./pages/monumentos-deleted/monumentos-deleted').then(
        (component) => component.MonumentosDeleted,
      ),
    title: 'Monumentos eliminados | SIGPAC',
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/monumentos-edit/monumentos-edit').then(
        (component) => component.MonumentosEdit,
      ),
    title: 'Editar monumento | SIGPAC',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/monumentos-detail/monumentos-detail').then(
        (component) => component.MonumentosDetail,
      ),
    title: 'Detalle de monumento | SIGPAC',
  },
];
