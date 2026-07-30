import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      label: 'Parques',
      icon: 'park',
      route: '/parks',
    },
    {
      label: 'Jardines',
      icon: 'local_florist',
      route: '/gardens',
    },
    {
      label: 'Monumentos',
      icon: 'account_balance',
      route: '/monuments',
    },
    {
      label: 'Plazas',
      icon: 'location_city',
      route: '/squares',
    },
    {
      label: 'Calles',
      icon: 'signpost',
      route: '/streets',
    },
    {
      label: 'Avenidas',
      icon: 'add_road',
      route: '/avenues',
    },
    {
      label: 'Personajes',
      icon: 'groups',
      route: '/people',
    },
  ];
}
