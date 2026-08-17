import { Routes } from '@angular/router';

export const PLAZAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/plazas-list/plazas-list').then((m) => m.PlazasList),
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./pages/plazas-create/plazas-create').then((m) => m.PlazasCreate),
  },
  {
    path: 'eliminados',
    loadComponent: () =>
      import('./pages/plazas-deleted/plazas-deleted').then((m) => m.PlazasDeleted),
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./pages/plazas-edit/plazas-edit').then((m) => m.PlazasEdit),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/plazas-detail/plazas-detail').then((m) => m.PlazasDetail),
  },
];
