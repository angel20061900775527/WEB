import { Routes } from '@angular/router';

export const MUSEOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/museos-list/museos-list').then((m) => m.MuseosList),
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./pages/museos-create/museos-create').then((m) => m.MuseosCreate),
  },
  {
    path: 'eliminados',
    loadComponent: () =>
      import('./pages/museos-deleted/museos-deleted').then((m) => m.MuseosDeleted),
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./pages/museos-edit/museos-edit').then((m) => m.MuseosEdit),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/museos-detail/museos-detail').then((m) => m.MuseosDetail),
  },
];
