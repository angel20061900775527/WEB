import { MenuItem } from './menu.model';

export const MENU_CONFIG: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard',
  },
  {
    label: 'Parques',
    icon: 'park',
    route: '/parques',
  },
  {
    label: 'Calles',
    icon: 'signpost',
    route: '/calles',
  },
  {
    label: 'Monumentos',
    icon: 'account_balance',
    route: '/monumentos',
  },
  {
    label: 'Ríos',
    icon: 'water',
    route: '/rios',
  },
  {
    label: 'Plazas',
    icon: 'location_city',
    route: '/plazas',
  },
  {
    label: 'Museos',
    icon: 'museum',
    route: '/museos',
  },
  {
    label: 'Auditorios',
    icon: 'theater_comedy',
    route: '/auditorios',
  },
  {
    label: 'Usuarios',
    icon: 'manage_accounts',
    route: '/usuarios',
  },
];
