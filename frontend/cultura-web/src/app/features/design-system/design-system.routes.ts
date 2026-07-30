import { Routes } from '@angular/router';

export const DESIGN_SYSTEM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./design-system/design-system').then((component) => component.DesignSystem),
    title: 'Design System | SIGPAC',
  },
];
