import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Auditorio } from '../../../../core/services/auditorios.service';
import { AuditoriosPublicService } from '../../../../core/services/auditorios-public.service';

@Component({
  selector: 'app-public-auditorios-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './auditorios-list.html',
  styleUrl: './auditorios-list.scss',
})
export class AuditoriosList implements OnInit {
  private readonly auditoriosService = inject(AuditoriosPublicService);

  readonly auditorios = signal<Auditorio[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly page = signal(1);
  readonly limit = signal(12);
  readonly total = signal(0);
  readonly totalPages = signal(0);

  ngOnInit(): void {
    this.cargarAuditorios();
  }

  cargarAuditorios(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.auditoriosService.getAll(this.page(), this.limit(), '', 'ASC').subscribe({
      next: (response) => {
        this.auditorios.set(response.auditorios);
        this.total.set(response.total);
        this.totalPages.set(response.totalPages);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el listado de auditorios.');
        this.cargando.set(false);
      },
    });
  }
}
