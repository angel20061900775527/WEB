import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppCardComponent } from '../../shared/components/app-card/app-card';

interface StatisticCard {
  title: string;
  total: number;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, MatIconModule, AppCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  readonly statistics: StatisticCard[] = [
    {
      title: 'Parques',
      total: 0,
      icon: 'park',
      description: 'Espacios registrados',
    },
    {
      title: 'Monumentos',
      total: 0,
      icon: 'account_balance',
      description: 'Bienes patrimoniales',
    },
    {
      title: 'Plazas',
      total: 0,
      icon: 'location_city',
      description: 'Espacios públicos',
    },
    {
      title: 'Personajes',
      total: 0,
      icon: 'groups',
      description: 'Personajes históricos',
    },
  ];
}
