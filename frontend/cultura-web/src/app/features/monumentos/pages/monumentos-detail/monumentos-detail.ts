import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';
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
  private readonly fotografiasService = inject(FotografiasService);
  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });

  monumento = signal<Monumento | null>(null);
  fotografias = signal<Fotografia[]>([]);

  archivoSeleccionado = signal<File | null>(null);
  descripcionFotografia = signal('');

  loading = signal(false);
  loadingFotografias = signal(false);
  subiendoFotografia = signal(false);
  cambiandoPrincipal = signal(false);
  eliminandoFotografia = signal(false);

  error = signal('');
  errorFotografias = signal('');

  cambiandoEstado = signal(false);
  mensajeEstado = signal('');
  mensajeFotografias = signal('');

  readonly fotografiaPrincipal = computed(() => {
    const monumentoActual = this.monumento();

    if (!monumentoActual?.fotografiaPrincipalId) {
      return null;
    }

    return (
      this.fotografias().find(
        (foto) => String(foto.id) === String(monumentoActual.fotografiaPrincipalId),
      ) ?? null
    );
  });

  readonly fotografiasSecundarias = computed(() => {
    const principal = this.fotografiaPrincipal();

    if (!principal) {
      return this.fotografias();
    }

    return this.fotografias().filter((foto) => String(foto.id) !== String(principal.id));
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del monumento.');
      return;
    }

    this.cargarMonumento(id);
    this.cargarFotografias(id);
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

  private cargarFotografias(id: string): void {
    this.loadingFotografias.set(true);
    this.errorFotografias.set('');

    this.fotografiasService.getAll('MONUMENTO', id).subscribe({
      next: (fotografias) => {
        this.fotografias.set(fotografias);
        this.loadingFotografias.set(false);
      },
      error: (error) => {
        console.error('Error al cargar fotografías:', error);

        this.errorFotografias.set(
          error?.error?.message ?? 'No se pudieron cargar las fotografías.',
        );

        this.loadingFotografias.set(false);
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

  seleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.archivoSeleccionado.set(file);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');
  }

  actualizarDescripcion(valor: string): void {
    this.descripcionFotografia.set(valor);
  }

  subirFotografia(): void {
    const monumentoActual = this.monumento();
    const file = this.archivoSeleccionado();

    if (!monumentoActual) {
      return;
    }

    if (!file) {
      this.errorFotografias.set('Seleccione una imagen antes de continuar.');
      return;
    }

    this.subiendoFotografia.set(true);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    this.fotografiasService
      .upload('MONUMENTO', monumentoActual.id, file, this.descripcionFotografia())
      .subscribe({
        next: (fotografia) => {
          this.fotografias.update((fotografias) => [fotografia, ...fotografias]);

          this.archivoSeleccionado.set(null);
          this.descripcionFotografia.set('');

          this.mensajeFotografias.set('Fotografía subida correctamente.');

          this.subiendoFotografia.set(false);
        },
        error: (error) => {
          console.error('Error al subir fotografía:', error);

          this.errorFotografias.set(error?.error?.message ?? 'No se pudo subir la fotografía.');

          this.subiendoFotografia.set(false);
        },
      });
  }

  establecerPrincipal(fotografia: Fotografia): void {
    const monumentoActual = this.monumento();

    if (!monumentoActual) {
      return;
    }

    if (String(monumentoActual.fotografiaPrincipalId) === String(fotografia.id)) {
      return;
    }

    this.cambiandoPrincipal.set(true);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    this.fotografiasService.setPrincipal(fotografia.id).subscribe({
      next: () => {
        this.monumento.update((monumento) =>
          monumento
            ? {
                ...monumento,
                fotografiaPrincipalId: fotografia.id,
              }
            : null,
        );

        this.mensajeFotografias.set('Fotografía principal actualizada correctamente.');

        this.cambiandoPrincipal.set(false);
      },
      error: (error) => {
        console.error('Error al establecer fotografía principal:', error);

        this.errorFotografias.set(
          error?.error?.message ?? 'No se pudo establecer la fotografía principal.',
        );

        this.cambiandoPrincipal.set(false);
      },
    });
  }

  eliminarFotografia(fotografia: Fotografia): void {
    const monumentoActual = this.monumento();

    if (!monumentoActual) {
      return;
    }

    if (String(monumentoActual.fotografiaPrincipalId) === String(fotografia.id)) {
      this.errorFotografias.set('No puede eliminar la fotografía principal.');
      return;
    }

    const confirmado = window.confirm(
      `¿Está seguro de eliminar la fotografía "${fotografia.nombreOriginal}"?`,
    );

    if (!confirmado) {
      return;
    }

    this.eliminandoFotografia.set(true);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    this.fotografiasService.delete(fotografia.id).subscribe({
      next: () => {
        this.fotografias.update((fotografias) =>
          fotografias.filter((item) => String(item.id) !== String(fotografia.id)),
        );

        this.mensajeFotografias.set('Fotografía eliminada correctamente.');

        this.eliminandoFotografia.set(false);
      },
      error: (error) => {
        console.error('Error al eliminar fotografía:', error);

        this.errorFotografias.set(error?.error?.message ?? 'No se pudo eliminar la fotografía.');

        this.eliminandoFotografia.set(false);
      },
    });
  }
}
