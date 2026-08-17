import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { EstadoRio, Rio, RiosService } from '../../../../core/services/rios.service';

@Component({
  selector: 'app-rios-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './rios-detail.html',
  styleUrl: './rios-detail.scss',
})
export class RiosDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly riosService = inject(RiosService);

  rio = signal<Rio | null>(null);

  loading = signal(false);
  error = signal('');

  cambiandoEstado = signal(false);
  mensajeEstado = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del río.');
      return;
    }

    this.cargarRio(id);
  }

  private cargarRio(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.riosService.getById(id).subscribe({
      next: (rio) => {
        this.rio.set(rio);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar río:', error);

        this.error.set('No se pudo cargar la información del río.');

        this.loading.set(false);
      },
    });
  }

  editar(): void {
    const rioActual = this.rio();

    if (!rioActual) {
      return;
    }

    this.router.navigate(['/rios', rioActual.id, 'editar']);
  }

  cambiarEstado(estado: EstadoRio): void {
    const rioActual = this.rio();

    if (!rioActual || rioActual.estado === estado) {
      return;
    }

    this.cambiandoEstado.set(true);
    this.error.set('');
    this.mensajeEstado.set('');

    this.riosService.updateEstado(rioActual.id, estado).subscribe({
      next: () => {
        this.rio.update((rio) =>
          rio
            ? {
                ...rio,
                estado,
              }
            : null,
        );

        this.mensajeEstado.set('Estado actualizado correctamente.');

        this.cambiandoEstado.set(false);
      },
      error: (error) => {
        console.error('Error al cambiar estado del río:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el estado del río.');

        this.cambiandoEstado.set(false);
      },
    });
  }
}
