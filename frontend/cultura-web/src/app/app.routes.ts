import { Routes } from '@angular/router';

import { Layout } from './core/layout/layout';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
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
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
