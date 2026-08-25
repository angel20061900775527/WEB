import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Rio } from '../../../../core/services/rios.service';
import { RiosPublicService } from '../../../../core/services/rios-public.service';

@Component({
  selector: 'app-public-rios-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './rios-list.html',
  styleUrl: './rios-list.scss',
})
export class RiosList implements OnInit {
  private readonly riosService = inject(RiosPublicService);

  readonly rios = signal<Rio[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly page = signal(1);
  readonly limit = signal(12);
  readonly total = signal(0);
  readonly totalPages = signal(0);

  ngOnInit(): void {
    this.cargarRios();
  }

  cargarRios(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.riosService.getAll(this.page(), this.limit(), '', 'ASC').subscribe({
      next: (response) => {
        this.rios.set(response.rios);
        this.total.set(response.total);
        this.totalPages.set(response.totalPages);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el listado de ríos.');
        this.cargando.set(false);
      },
    });
  }
}
