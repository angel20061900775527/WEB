import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { EstadoParque, Parque, ParquesService } from '../../../../core/services/parques.service';

@Component({
  selector: 'app-parques-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './parques-detail.html',
  styleUrl: './parques-detail.scss',
})
export class ParquesDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly parquesService = inject(ParquesService);
  private readonly router = inject(Router);

  parque = signal<Parque | null>(null);
  loading = signal(false);
  error = signal('');
  cambiandoEstado = signal(false);
  mensajeEstado = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del parque.');
      return;
    }

    this.cargarParque(id);
  }

  private cargarParque(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.parquesService.getById(id).subscribe({
      next: (parque) => {
        this.parque.set(parque);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar parque:', error);

        this.error.set('No se pudo cargar la información del parque.');
        this.loading.set(false);
      },
    });
  }
  editar(): void {
    const parqueActual = this.parque();

    if (!parqueActual) {
      return;
    }

    this.router.navigate(['/parques', parqueActual.id, 'editar']);
  }
  cambiarEstado(estado: EstadoParque): void {
    const parqueActual = this.parque();

    if (!parqueActual || parqueActual.estado === estado) {
      return;
    }

    this.cambiandoEstado.set(true);
    this.error.set('');
    this.mensajeEstado.set('');

    this.parquesService.updateEstado(parqueActual.id, estado).subscribe({
      next: () => {
        this.parque.update((parque) =>
          parque
            ? {
                ...parque,
                estado,
              }
            : null,
        );

        this.mensajeEstado.set('Estado actualizado correctamente.');
        this.cambiandoEstado.set(false);
      },
      error: (error) => {
        console.error('Error al cambiar estado del parque:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el estado del parque.');

        this.cambiandoEstado.set(false);
      },
    });
  }
}
