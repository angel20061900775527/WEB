import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Museo } from '../../../../core/services/museos.service';
import { MuseosPublicService } from '../../../../core/services/museos-public.service';

@Component({
  selector: 'app-public-museos-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './museos-list.html',
  styleUrl: './museos-list.scss',
})
export class MuseosList implements OnInit {
  private readonly museosService = inject(MuseosPublicService);

  readonly museos = signal<Museo[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly page = signal(1);
  readonly limit = signal(12);
  readonly total = signal(0);
  readonly totalPages = signal(0);

  ngOnInit(): void {
    this.cargarMuseos();
  }

  cargarMuseos(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.museosService.getAll(this.page(), this.limit(), '', 'ASC').subscribe({
      next: (response) => {
        this.museos.set(response.museos);
        this.total.set(response.total);
        this.totalPages.set(response.totalPages);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el listado de museos.');
        this.cargando.set(false);
      },
    });
  }
}
