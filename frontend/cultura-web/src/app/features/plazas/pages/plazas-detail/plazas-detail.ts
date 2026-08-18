import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { EstadoPlaza, Plaza, PlazasService } from '../../../../core/services/plazas.service';

@Component({
  selector: 'app-plazas-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './plazas-detail.html',
  styleUrl: './plazas-detail.scss',
})
export class PlazasDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly plazasService = inject(PlazasService);
  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });

  plaza = signal<Plaza | null>(null);

  loading = signal(false);
  error = signal('');

  cambiandoEstado = signal(false);
  mensajeEstado = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador de la plaza.');
      return;
    }

    this.cargarPlaza(id);
  }

  private cargarPlaza(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.plazasService.getById(id).subscribe({
      next: (plaza) => {
        this.plaza.set(plaza);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar plaza:', error);

        this.error.set('No se pudo cargar la información de la plaza.');

        this.loading.set(false);
      },
    });
  }

  editar(): void {
    const plazaActual = this.plaza();

    if (!plazaActual) {
      return;
    }

    this.router.navigate(['/plazas', plazaActual.id, 'editar']);
  }

  cambiarEstado(estado: EstadoPlaza): void {
    const plazaActual = this.plaza();

    if (!plazaActual || plazaActual.estado === estado) {
      return;
    }

    this.cambiandoEstado.set(true);
    this.error.set('');
    this.mensajeEstado.set('');

    this.plazasService.updateEstado(plazaActual.id, estado).subscribe({
      next: () => {
        this.plaza.update((plaza) =>
          plaza
            ? {
                ...plaza,
                estado,
              }
            : null,
        );

        this.mensajeEstado.set('Estado actualizado correctamente.');

        this.cambiandoEstado.set(false);
      },
      error: (error) => {
        console.error('Error al cambiar estado de la plaza:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el estado de la plaza.');

        this.cambiandoEstado.set(false);
      },
    });
  }
}
