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
