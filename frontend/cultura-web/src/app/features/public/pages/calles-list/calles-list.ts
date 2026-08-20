import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Calle } from '../../../../core/services/calles.service';
import { CallesPublicService } from '../../../../core/services/calles-public.service';

@Component({
  selector: 'app-public-calles-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './calles-list.html',
  styleUrl: './calles-list.scss',
})
export class CallesList implements OnInit {
  private readonly callesService = inject(CallesPublicService);

  readonly calles = signal<Calle[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly page = signal(1);
  readonly limit = signal(12);
  readonly total = signal(0);
  readonly totalPages = signal(0);

  ngOnInit(): void {
    this.cargarCalles();
  }

  cargarCalles(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.callesService.getAll(this.page(), this.limit(), '', 'ASC').subscribe({
      next: (response) => {
        this.calles.set(response.calles);
        this.total.set(response.total);
        this.totalPages.set(response.totalPages);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el listado de calles.');
        this.cargando.set(false);
      },
    });
  }
}
