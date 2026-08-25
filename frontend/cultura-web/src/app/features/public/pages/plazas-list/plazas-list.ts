import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Plaza } from '../../../../core/services/plazas.service';
import { PlazasPublicService } from '../../../../core/services/plazas-public.service';

@Component({
  selector: 'app-public-plazas-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './plazas-list.html',
  styleUrl: './plazas-list.scss',
})
export class PlazasList implements OnInit {
  private readonly plazasService = inject(PlazasPublicService);

  readonly plazas = signal<Plaza[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly page = signal(1);
  readonly limit = signal(12);
  readonly total = signal(0);
  readonly totalPages = signal(0);

  ngOnInit(): void {
    this.cargarPlazas();
  }

  cargarPlazas(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.plazasService.getAll(this.page(), this.limit(), '', 'ASC').subscribe({
      next: (response) => {
        this.plazas.set(response.plazas);
        this.total.set(response.total);
        this.totalPages.set(response.totalPages);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el listado de plazas.');
        this.cargando.set(false);
      },
    });
  }
}
