import { Routes } from '@angular/router';

import { LayoutComponent } from './core/layout/layout/layout';
import { Dashboard } from './features/dashboard/dashboard';
import { DesignSystem } from './features/design-system/design-system/design-system';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
        title: 'Dashboard | SIGPAC',
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },

      {
        path: 'design-system',
        component: DesignSystem,
        title: 'Design System | SIGPAC',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
