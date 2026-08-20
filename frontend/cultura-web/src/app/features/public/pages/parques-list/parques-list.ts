import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Parque } from '../../../../core/services/parques.service';
import { ParquesPublicService } from '../../../../core/services/parques-public.service';
@Component({
  selector: 'app-public-parques-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './parques-list.html',
  styleUrl: './parques-list.scss',
})
export class ParquesList implements OnInit {
  private readonly parquesService = inject(ParquesPublicService);

  readonly parques = signal<Parque[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly page = signal(1);
  readonly limit = signal(12);
  readonly total = signal(0);
  readonly totalPages = signal(0);

  ngOnInit(): void {
    this.cargarParques();
  }

  cargarParques(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.parquesService.getAll(this.page(), this.limit(), '', 'ASC').subscribe({
      next: (response) => {
        this.parques.set(response.parques);
        this.total.set(response.total);
        this.totalPages.set(response.totalPages);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el listado de parques.');
        this.cargando.set(false);
      },
    });
  }
}
