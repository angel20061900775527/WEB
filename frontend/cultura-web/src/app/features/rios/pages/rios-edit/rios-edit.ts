import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';

import {
  EstadoConservacionRio,
  EstadoRio,
  Rio,
  RiosService,
  TipoRio,
  UpdateRioPayload,
} from '../../../../core/services/rios.service';

interface FotografiaSeleccionada {
  id: number;
  archivo: File;
  descripcion: string;
  estado: 'PENDIENTE' | 'SUBIENDO' | 'COMPLETADA' | 'ERROR';
  error?: string;
}

@Component({
  selector: 'app-rios-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './rios-edit.html',
  styleUrl: './rios-edit.scss',
})
export class RiosEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly riosService = inject(RiosService);
  private readonly fotografiasService = inject(FotografiasService);

  private contadorArchivos = 0;

  rioId = '';

  rio = signal<Rio | null>(null);
  fotografias = signal<Fotografia[]>([]);
  fotografiasSeleccionadas = signal<FotografiaSeleccionada[]>([]);

  loading = signal(false);
  saving = signal(false);
  loadingFotografias = signal(false);

  subiendoFotografia = signal(false);
  cambiandoPrincipal = signal(false);
  eliminandoFotografia = signal(false);

  error = signal('');
  success = signal('');

  errorFotografias = signal('');
  mensajeFotografias = signal('');

  estado = signal<EstadoRio>('BORRADOR');

  readonly totalPendientes = computed(
    () =>
      this.fotografiasSeleccionadas().filter(
        (fotografia) => fotografia.estado === 'PENDIENTE' || fotografia.estado === 'ERROR',
      ).length,
  );

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    descripcion: ['', Validators.required],
    resenaHistorica: [''],
    ubicacion: ['', [Validators.required, Validators.maxLength(255)]],
    longitudKm: [''],
    cuencaHidrografica: [''],
    afluenteDe: [''],
    estadoConservacion: this.fb.nonNullable.control<EstadoConservacionRio>('BUENO'),
    tipo: this.fb.nonNullable.control<TipoRio>('PRINCIPAL'),
    aptoBalneario: [false],
    latitud: [''],
    longitud: [''],
    fuentesInformacion: [''],
    observaciones: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del río.');
      return;
    }

    this.rioId = id;

    this.cargarRio(id);
    this.cargarFotografias(id);
  }

  private cargarRio(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.riosService.getById(id).subscribe({
      next: (rio: Rio) => {
        this.rio.set(rio);
        this.estado.set(rio.estado);

        this.form.patchValue({
          nombre: rio.nombre,
          descripcion: rio.descripcion,
          resenaHistorica: rio.resenaHistorica ?? '',
          ubicacion: rio.ubicacion,

          longitudKm:
            rio.longitudKm !== null && rio.longitudKm !== undefined ? String(rio.longitudKm) : '',

          cuencaHidrografica: rio.cuencaHidrografica ?? '',
          afluenteDe: rio.afluenteDe ?? '',
          estadoConservacion: rio.estadoConservacion,
          tipo: rio.tipo,
          aptoBalneario: rio.aptoBalneario,

          latitud: rio.latitud !== null && rio.latitud !== undefined ? String(rio.latitud) : '',

          longitud: rio.longitud !== null && rio.longitud !== undefined ? String(rio.longitud) : '',

          fuentesInformacion: rio.fuentesInformacion ?? '',
          observaciones: rio.observaciones ?? '',
        });

        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error al cargar río:', error);

        this.error.set('No se pudo cargar la información del río.');
        this.loading.set(false);
      },
    });
  }

  private cargarFotografias(id: string): void {
    this.loadingFotografias.set(true);
    this.errorFotografias.set('');

    this.fotografiasService.getAll('RIO', id).subscribe({
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

  esPrincipal(fotografia: Fotografia): boolean {
    const rioActual = this.rio();

    if (!rioActual?.fotografiaPrincipalId) {
      return false;
    }

    return String(rioActual.fotografiaPrincipalId) === String(fotografia.id);
  }

  seleccionarArchivos(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivos = Array.from(input.files ?? []);

    if (archivos.length === 0) {
      return;
    }

    const nuevasFotografias: FotografiaSeleccionada[] = archivos.map((archivo) => ({
      id: ++this.contadorArchivos,
      archivo,
      descripcion: '',
      estado: 'PENDIENTE',
    }));

    this.fotografiasSeleccionadas.update((actuales) => [...actuales, ...nuevasFotografias]);

    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

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

    this.errorFotografias.set('');
    this.mensajeFotografias.set('');
  }

  limpiarSeleccion(): void {
    if (this.subiendoFotografia()) {
      return;
    }

    this.fotografiasSeleccionadas.set([]);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');
  }

  subirFotografias(): void {
    if (this.subiendoFotografia()) {
      return;
    }

    const pendientes = this.fotografiasSeleccionadas().filter(
      (fotografia) => fotografia.estado === 'PENDIENTE' || fotografia.estado === 'ERROR',
    );

    if (pendientes.length === 0) {
      return;
    }

    this.subiendoFotografia.set(true);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    this.subirSiguienteFotografia(pendientes, 0, 0, 0);
  }

  private subirSiguienteFotografia(
    pendientes: FotografiaSeleccionada[],
    indice: number,
    completadas: number,
    errores: number,
  ): void {
    if (indice >= pendientes.length) {
      this.finalizarCargaFotografias(completadas, errores);
      return;
    }

    const fotografia = pendientes[indice];

    this.actualizarEstadoSeleccionada(fotografia.id, 'SUBIENDO');

    this.fotografiasService
      .upload('RIO', this.rioId, fotografia.archivo, fotografia.descripcion.trim())
      .subscribe({
        next: (fotografiaSubida) => {
          this.fotografias.update((actuales) => [fotografiaSubida, ...actuales]);

          this.actualizarEstadoSeleccionada(fotografia.id, 'COMPLETADA');

          this.subirSiguienteFotografia(pendientes, indice + 1, completadas + 1, errores);
        },

        error: (error) => {
          console.error('Error al subir fotografía:', error);

          this.actualizarEstadoSeleccionada(
            fotografia.id,
            'ERROR',
            error?.error?.message ?? 'No se pudo subir la fotografía.',
          );

          this.subirSiguienteFotografia(pendientes, indice + 1, completadas, errores + 1);
        },
      });
  }

  private finalizarCargaFotografias(completadas: number, errores: number): void {
    this.subiendoFotografia.set(false);

    if (errores === 0) {
      this.fotografiasSeleccionadas.set([]);

      this.mensajeFotografias.set(
        completadas === 1
          ? 'Fotografía subida correctamente.'
          : `${completadas} fotografías subidas correctamente.`,
      );

      return;
    }

    this.fotografiasSeleccionadas.update((fotografias) =>
      fotografias.filter((fotografia) => fotografia.estado !== 'COMPLETADA'),
    );

    if (completadas > 0) {
      this.mensajeFotografias.set(
        `${completadas} fotografía${completadas === 1 ? '' : 's'} subida${
          completadas === 1 ? '' : 's'
        } correctamente.`,
      );
    }

    this.errorFotografias.set(
      `${errores} fotografía${errores === 1 ? '' : 's'} no ${
        errores === 1 ? 'pudo' : 'pudieron'
      } subirse. Puede volver a intentarlo.`,
    );
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

  establecerPrincipal(fotografia: Fotografia): void {
    if (this.esPrincipal(fotografia)) {
      return;
    }

    this.cambiandoPrincipal.set(true);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    this.fotografiasService.setPrincipal(fotografia.id).subscribe({
      next: () => {
        this.rio.update((rio) =>
          rio
            ? {
                ...rio,
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
    if (this.esPrincipal(fotografia)) {
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

  guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const longitudKmTexto = String(value.longitudKm ?? '').trim();

    const latitudTexto = String(value.latitud ?? '').trim();

    const longitudTexto = String(value.longitud ?? '').trim();

    const payload: UpdateRioPayload = {
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim(),

      resenaHistorica: value.resenaHistorica.trim() || null,

      ubicacion: value.ubicacion.trim(),

      longitudKm: longitudKmTexto ? Number(longitudKmTexto) : null,

      cuencaHidrografica: value.cuencaHidrografica.trim() || null,

      afluenteDe: value.afluenteDe.trim() || null,

      estadoConservacion: value.estadoConservacion,

      tipo: value.tipo,

      aptoBalneario: value.aptoBalneario,

      latitud: latitudTexto ? Number(latitudTexto) : null,

      longitud: longitudTexto ? Number(longitudTexto) : null,

      fuentesInformacion: value.fuentesInformacion.trim() || null,

      observaciones: value.observaciones.trim() || null,
    };

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    this.riosService.update(this.rioId, payload).subscribe({
      next: () => {
        this.riosService.updateEstado(this.rioId, this.estado()).subscribe({
          next: () => {
            this.saving.set(false);

            this.success.set('Río actualizado correctamente.');

            this.router.navigate(['/rios', this.rioId]);
          },

          error: (error) => {
            console.error('Error al actualizar estado del río:', error);

            this.error.set(
              error?.error?.message ??
                'Los datos se actualizaron, pero no se pudo actualizar el estado.',
            );

            this.saving.set(false);
          },
        });
      },

      error: (error) => {
        console.error('Error al actualizar río:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el río.');

        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/rios', this.rioId]);
  }
}
