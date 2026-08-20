import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: 'parques',
    loadComponent: () => import('./pages/parques-list/parques-list').then((m) => m.ParquesList),
  },
  {
    path: 'parques/:id',
    loadComponent: () =>
      import('./pages/parques-detail/parques-detail').then((m) => m.ParquesDetail),
  },
  {
    path: 'calles',
    loadComponent: () => import('./pages/calles-list/calles-list').then((m) => m.CallesList),
  },
  {
    path: 'calles/:id',
    loadComponent: () => import('./pages/calles-detail/calles-detail').then((m) => m.CallesDetail),
  },
];
