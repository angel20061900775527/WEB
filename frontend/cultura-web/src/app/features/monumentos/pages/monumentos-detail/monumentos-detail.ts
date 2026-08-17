import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  EstadoMonumento,
  Monumento,
  MonumentosService,
} from '../../../../core/services/monumentos.service';

@Component({
  selector: 'app-monumentos-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './monumentos-detail.html',
  styleUrl: './monumentos-detail.scss',
})
export class MonumentosDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly monumentosService = inject(MonumentosService);

  monumento = signal<Monumento | null>(null);

  loading = signal(false);
  error = signal('');

  cambiandoEstado = signal(false);
  mensajeEstado = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del monumento.');
      return;
    }

    this.cargarMonumento(id);
  }

  private cargarMonumento(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.monumentosService.getById(id).subscribe({
      next: (monumento) => {
        this.monumento.set(monumento);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar monumento:', error);

        this.error.set('No se pudo cargar la información del monumento.');

        this.loading.set(false);
      },
    });
  }

  editar(): void {
    const monumentoActual = this.monumento();

    if (!monumentoActual) {
      return;
    }

    this.router.navigate(['/monumentos', monumentoActual.id, 'editar']);
  }

  cambiarEstado(estado: EstadoMonumento): void {
    const monumentoActual = this.monumento();

    if (!monumentoActual || monumentoActual.estado === estado) {
      return;
    }

    this.cambiandoEstado.set(true);
    this.error.set('');
    this.mensajeEstado.set('');

    this.monumentosService.updateEstado(monumentoActual.id, estado).subscribe({
      next: () => {
        this.monumento.update((monumento) =>
          monumento
            ? {
                ...monumento,
                estado,
              }
            : null,
        );

        this.mensajeEstado.set('Estado actualizado correctamente.');

        this.cambiandoEstado.set(false);
      },
      error: (error) => {
        console.error('Error al cambiar estado del monumento:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el estado del monumento.');

        this.cambiandoEstado.set(false);
      },
    });
  }
}
