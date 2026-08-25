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
  {
    path: 'monumentos',
    loadComponent: () =>
      import('./pages/monumentos-list/monumentos-list').then((m) => m.MonumentosList),
  },
  {
    path: 'monumentos/:id',
    loadComponent: () =>
      import('./pages/monumentos-detail/monumentos-detail').then((m) => m.MonumentosDetail),
  },
  {
    path: 'rios',
    loadComponent: () => import('./pages/rios-list/rios-list').then((m) => m.RiosList),
  },
  {
    path: 'rios/:id',
    loadComponent: () => import('./pages/rios-detail/rios-detail').then((m) => m.RiosDetail),
  },
  {
    path: 'plazas',
    loadComponent: () => import('./pages/plazas-list/plazas-list').then((m) => m.PlazasList),
  },
  {
    path: 'plazas/:id',
    loadComponent: () => import('./pages/plazas-detail/plazas-detail').then((m) => m.PlazasDetail),
  },
  {
    path: 'museos',
    loadComponent: () => import('./pages/museos-list/museos-list').then((m) => m.MuseosList),
  },
  {
    path: 'museos/:id',
    loadComponent: () => import('./pages/museos-detail/museos-detail').then((m) => m.MuseosDetail),
  },
  {
    path: 'auditorios',
    loadComponent: () =>
      import('./pages/auditorios-list/auditorios-list').then((m) => m.AuditoriosList),
  },
  {
    path: 'auditorios/:id',
    loadComponent: () =>
      import('./pages/auditorios-detail/auditorios-detail').then((m) => m.AuditoriosDetail),
  },
];
