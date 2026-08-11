import { Routes } from '@angular/router';

export const PARQUES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/parques-list/parques-list').then((component) => component.ParquesList),
    title: 'Parques | SIGPAC',
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/parques-create/parques-create').then((component) => component.ParquesCreate),
    title: 'Nuevo parque | SIGPAC',
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/parques-edit/parques-edit').then((component) => component.ParquesEdit),
    title: 'Editar parque | SIGPAC',
  },
  {
    path: 'eliminados',
    loadComponent: () =>
      import('./pages/parques-deleted/parques-deleted').then(
        (component) => component.ParquesDeleted,
      ),
    title: 'Parques eliminados | SIGPAC',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/parques-detail/parques-detail').then((component) => component.ParquesDetail),
    title: 'Detalle del parque | SIGPAC',
  },
];
