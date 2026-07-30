import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  readonly sidebarOpened = signal(true);

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

  toggleSidebar(): void {
    this.sidebarOpened.update((opened) => !opened);
  }
}
