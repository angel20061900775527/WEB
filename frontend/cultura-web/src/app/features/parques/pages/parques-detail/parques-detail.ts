import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';
import { EstadoParque, Parque, ParquesService } from '../../../../core/services/parques.service';

interface FotografiaSeleccionada {
  id: number;
  archivo: File;
  descripcion: string;
  estado: 'PENDIENTE' | 'SUBIENDO' | 'COMPLETADA' | 'ERROR';
  error?: string;
}

@Component({
  selector: 'app-parques-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './parques-detail.html',
  styleUrl: './parques-detail.scss',
})
export class ParquesDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly parquesService = inject(ParquesService);
  private readonly fotografiasService = inject(FotografiasService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  private contadorArchivos = 0;

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });

  parque = signal<Parque | null>(null);
  fotografias = signal<Fotografia[]>([]);

  fotografiasSeleccionadas = signal<FotografiaSeleccionada[]>([]);

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
    const parqueActual = this.parque();
    const fotos = this.fotografias();

    if (!parqueActual?.fotografiaPrincipalId) {
      return null;
    }

    return (
      fotos.find((foto) => String(foto.id) === String(parqueActual.fotografiaPrincipalId)) ?? null
    );
  });

  readonly fotografiasSecundarias = computed(() => {
    const principal = this.fotografiaPrincipal();

    if (!principal) {
      return this.fotografias();
    }

    return this.fotografias().filter((foto) => String(foto.id) !== String(principal.id));
  });

  readonly totalSeleccionadas = computed(() => this.fotografiasSeleccionadas().length);

  readonly totalCompletadas = computed(
    () => this.fotografiasSeleccionadas().filter((item) => item.estado === 'COMPLETADA').length,
  );

  readonly totalErrores = computed(
    () => this.fotografiasSeleccionadas().filter((item) => item.estado === 'ERROR').length,
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del parque.');
      return;
    }

    this.cargarParque(id);
    this.cargarFotografias(id);
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

  private cargarFotografias(id: string): void {
    this.loadingFotografias.set(true);
    this.errorFotografias.set('');

    this.fotografiasService.getAll('PARQUE', id).subscribe({
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

  seleccionarArchivos(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivos = Array.from(input.files ?? []);

    this.mensajeFotografias.set('');
    this.errorFotografias.set('');

    if (archivos.length === 0) {
      return;
    }

    const nuevasFotografias: FotografiaSeleccionada[] = archivos.map((archivo) => ({
      id: ++this.contadorArchivos,
      archivo,
      descripcion: '',
      estado: 'PENDIENTE',
    }));

    this.fotografiasSeleccionadas.update((seleccionadas) => [
      ...seleccionadas,
      ...nuevasFotografias,
    ]);

    /*
     * Permite volver a seleccionar posteriormente
     * incluso el mismo archivo.
     */
    input.value = '';
  }

  actualizarDescripcion(id: number, descripcion: string): void {
    this.fotografiasSeleccionadas.update((fotografias) =>
      fotografias.map((fotografia) =>
        fotografia.id === id
          ? {
              ...fotografia,
              descripcion,
            }
          : fotografia,
      ),
    );
  }

  quitarFotografiaSeleccionada(id: number): void {
    if (this.subiendoFotografia()) {
      return;
    }

    this.fotografiasSeleccionadas.update((fotografias) =>
      fotografias.filter((fotografia) => fotografia.id !== id),
    );
  }

  limpiarSeleccion(): void {
    if (this.subiendoFotografia()) {
      return;
    }

    this.fotografiasSeleccionadas.set([]);
    this.mensajeFotografias.set('');
    this.errorFotografias.set('');
  }

  subirFotografias(): void {
    const parqueActual = this.parque();

    if (!parqueActual) {
      return;
    }

    const pendientes = this.fotografiasSeleccionadas().filter(
      (item) => item.estado === 'PENDIENTE' || item.estado === 'ERROR',
    );

    if (pendientes.length === 0) {
      this.errorFotografias.set('Seleccione al menos una imagen antes de continuar.');
      return;
    }

    this.subiendoFotografia.set(true);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    this.fotografiasSeleccionadas.update((fotografias) =>
      fotografias.map((item) =>
        pendientes.some((pendiente) => pendiente.id === item.id)
          ? {
              ...item,
              estado: 'PENDIENTE',
              error: undefined,
            }
          : item,
      ),
    );

    this.subirSiguienteFotografia(parqueActual.id, pendientes, 0, 0, 0);
  }

  private subirSiguienteFotografia(
    parqueId: string,
    fotografias: FotografiaSeleccionada[],
    indice: number,
    completadas: number,
    errores: number,
  ): void {
    if (indice >= fotografias.length) {
      this.finalizarCargaFotografias(completadas, errores);
      return;
    }

    const fotografia = fotografias[indice];

    this.actualizarEstadoSeleccionada(fotografia.id, 'SUBIENDO');

    this.fotografiasService
      .upload('PARQUE', parqueId, fotografia.archivo, fotografia.descripcion.trim())
      .subscribe({
        next: (fotografiaCreada) => {
          this.fotografias.update((fotografiasActuales) => [
            fotografiaCreada,
            ...fotografiasActuales,
          ]);

          this.actualizarEstadoSeleccionada(fotografia.id, 'COMPLETADA');

          this.subirSiguienteFotografia(
            parqueId,
            fotografias,
            indice + 1,
            completadas + 1,
            errores,
          );
        },
        error: (error) => {
          console.error(`Error al subir ${fotografia.archivo.name}:`, error);

          const mensaje = error?.error?.message ?? 'No se pudo subir esta fotografía.';

          this.actualizarEstadoSeleccionada(fotografia.id, 'ERROR', mensaje);

          this.subirSiguienteFotografia(
            parqueId,
            fotografias,
            indice + 1,
            completadas,
            errores + 1,
          );
        },
      });
  }

  private actualizarEstadoSeleccionada(
    id: number,
    estado: FotografiaSeleccionada['estado'],
    error?: string,
  ): void {
    this.fotografiasSeleccionadas.update((fotografias) =>
      fotografias.map((fotografia) =>
        fotografia.id === id
          ? {
              ...fotografia,
              estado,
              error,
            }
          : fotografia,
      ),
    );
  }

  private finalizarCargaFotografias(completadas: number, errores: number): void {
    this.subiendoFotografia.set(false);

    if (errores === 0) {
      this.mensajeFotografias.set(
        completadas === 1
          ? 'Fotografía subida correctamente.'
          : `${completadas} fotografías subidas correctamente.`,
      );

      this.fotografiasSeleccionadas.set([]);
      return;
    }

    if (completadas > 0) {
      this.mensajeFotografias.set(
        `${completadas} fotografía${completadas === 1 ? '' : 's'} subida${
          completadas === 1 ? '' : 's'
        } correctamente.`,
      );

      this.errorFotografias.set(
        `${errores} fotografía${errores === 1 ? '' : 's'} no ${
          errores === 1 ? 'pudo' : 'pudieron'
        } subirse. Puede volver a intentar únicamente las que fallaron.`,
      );

      return;
    }

    this.errorFotografias.set('No se pudo subir ninguna de las fotografías seleccionadas.');
  }

  establecerPrincipal(fotografia: Fotografia): void {
    const parqueActual = this.parque();

    if (!parqueActual) {
      return;
    }

    if (String(parqueActual.fotografiaPrincipalId) === String(fotografia.id)) {
      return;
    }

    this.cambiandoPrincipal.set(true);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    this.fotografiasService.setPrincipal(fotografia.id).subscribe({
      next: () => {
        this.parque.update((parque) =>
          parque
            ? {
                ...parque,
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
    const parqueActual = this.parque();

    if (!parqueActual) {
      return;
    }

    if (String(parqueActual.fotografiaPrincipalId) === String(fotografia.id)) {
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
