import { Routes } from '@angular/router';

import { LayoutComponent } from './core/layout/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((routes) => routes.DASHBOARD_ROUTES),
      },
      {
        path: 'design-system',
        loadChildren: () =>
          import('./features/design-system/design-system.routes').then(
            (routes) => routes.DESIGN_SYSTEM_ROUTES,
          ),
      },
      {
        path: 'parques',
        loadChildren: () =>
          import('./features/parques/parques.routes').then((routes) => routes.PARQUES_ROUTES),
      },
      {
        path: 'calles',
        loadChildren: () =>
          import('./features/calles/calles.routes').then((routes) => routes.CALLES_ROUTES),
      },
      {
        path: 'monumentos',
        loadChildren: () =>
          import('./features/monumentos/monumentos.routes').then(
            (routes) => routes.MONUMENTOS_ROUTES,
          ),
      },
      {
        path: 'rios',
        loadChildren: () =>
          import('./features/rios/rios.routes').then((routes) => routes.RIOS_ROUTES),
      },
      {
        path: 'plazas',
        loadChildren: () =>
          import('./features/plazas/plazas.routes').then((routes) => routes.PLAZAS_ROUTES),
      },
      {
        path: 'museos',
        loadChildren: () =>
          import('./features/museos/museos.routes').then((routes) => routes.MUSEOS_ROUTES),
      },
      {
        path: 'auditorios',
        loadChildren: () =>
          import('./features/auditorios/auditorios.routes').then(
            (routes) => routes.AUDITORIOS_ROUTES,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
