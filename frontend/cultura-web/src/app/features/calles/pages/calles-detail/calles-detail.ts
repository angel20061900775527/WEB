import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Calle, CallesService, EstadoCalle } from '../../../../core/services/calles.service';

@Component({
  selector: 'app-calles-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './calles-detail.html',
  styleUrl: './calles-detail.scss',
})
export class CallesDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly callesService = inject(CallesService);

  calle = signal<Calle | null>(null);
  loading = signal(false);
  error = signal('');

  cambiandoEstado = signal(false);
  mensajeEstado = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador de la calle.');
      return;
    }

    this.cargarCalle(id);
  }

  private cargarCalle(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.callesService.getById(id).subscribe({
      next: (calle) => {
        this.calle.set(calle);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar calle:', error);

        this.error.set('No se pudo cargar la información de la calle.');

        this.loading.set(false);
      },
    });
  }

  editar(): void {
    const calleActual = this.calle();

    if (!calleActual) {
      return;
    }

    this.router.navigate(['/calles', calleActual.id, 'editar']);
  }

  cambiarEstado(estado: EstadoCalle): void {
    const calleActual = this.calle();

    if (!calleActual || calleActual.estado === estado) {
      return;
    }

    this.cambiandoEstado.set(true);
    this.error.set('');
    this.mensajeEstado.set('');

    this.callesService.updateEstado(calleActual.id, estado).subscribe({
      next: () => {
        this.calle.update((calle) =>
          calle
            ? {
                ...calle,
                estado,
              }
            : null,
        );

        this.mensajeEstado.set('Estado actualizado correctamente.');

        this.cambiandoEstado.set(false);
      },
      error: (error) => {
        console.error('Error al cambiar estado de la calle:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el estado de la calle.');

        this.cambiandoEstado.set(false);
      },
    });
  }
}
