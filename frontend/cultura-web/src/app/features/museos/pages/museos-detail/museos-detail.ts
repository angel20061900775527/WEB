import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { EstadoMuseo, Museo, MuseosService } from '../../../../core/services/museos.service';

@Component({
  selector: 'app-museos-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './museos-detail.html',
  styleUrl: './museos-detail.scss',
})
export class MuseosDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly museosService = inject(MuseosService);
  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });

  museo = signal<Museo | null>(null);

  loading = signal(false);
  error = signal('');

  cambiandoEstado = signal(false);
  mensajeEstado = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del museo.');
      return;
    }

    this.cargarMuseo(id);
  }

  private cargarMuseo(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.museosService.getById(id).subscribe({
      next: (museo) => {
        this.museo.set(museo);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar museo:', error);

        this.error.set('No se pudo cargar la información del museo.');

        this.loading.set(false);
      },
    });
  }

  editar(): void {
    const museoActual = this.museo();

    if (!museoActual) {
      return;
    }

    this.router.navigate(['/museos', museoActual.id, 'editar']);
  }

  cambiarEstado(estado: EstadoMuseo): void {
    const museoActual = this.museo();

    if (!museoActual || museoActual.estado === estado) {
      return;
    }

    this.cambiandoEstado.set(true);
    this.error.set('');
    this.mensajeEstado.set('');

    this.museosService.updateEstado(museoActual.id, estado).subscribe({
      next: () => {
        this.museo.update((museo) =>
          museo
            ? {
                ...museo,
                estado,
              }
            : null,
        );

        this.mensajeEstado.set('Estado actualizado correctamente.');

        this.cambiandoEstado.set(false);
      },
      error: (error) => {
        console.error('Error al cambiar estado del museo:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el estado del museo.');

        this.cambiandoEstado.set(false);
      },
    });
  }
}
