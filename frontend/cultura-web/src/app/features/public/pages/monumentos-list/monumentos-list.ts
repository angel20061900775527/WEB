import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Monumento } from '../../../../core/services/monumentos.service';
import { MonumentosPublicService } from '../../../../core/services/monumentos-public.service';

@Component({
  selector: 'app-public-monumentos-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './monumentos-list.html',
  styleUrl: './monumentos-list.scss',
})
export class MonumentosList implements OnInit {
  private readonly monumentosService = inject(MonumentosPublicService);

  readonly monumentos = signal<Monumento[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly page = signal(1);
  readonly limit = signal(12);
  readonly total = signal(0);
  readonly totalPages = signal(0);

  ngOnInit(): void {
    this.cargarMonumentos();
  }

  cargarMonumentos(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.monumentosService.getAll(this.page(), this.limit(), '', 'ASC').subscribe({
      next: (response) => {
        this.monumentos.set(response.monumentos);
        this.total.set(response.total);
        this.totalPages.set(response.totalPages);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el listado de monumentos.');
        this.cargando.set(false);
      },
    });
  }
}
