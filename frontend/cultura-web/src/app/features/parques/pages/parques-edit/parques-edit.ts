import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';

import {
  EstadoParque,
  Parque,
  ParquesService,
  UpdateParquePayload,
} from '../../../../core/services/parques.service';

interface FotografiaSeleccionada {
  id: number;
  archivo: File;
  descripcion: string;
  estado: 'PENDIENTE' | 'SUBIENDO' | 'COMPLETADA' | 'ERROR';
  error?: string;
}

@Component({
  selector: 'app-parques-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './parques-edit.html',
  styleUrl: './parques-edit.scss',
})
export class ParquesEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private readonly parquesService = inject(ParquesService);

  private readonly fotografiasService = inject(FotografiasService);

  private contadorArchivos = 0;

  parqueId = '';

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

  estado = signal<EstadoParque>('BORRADOR');

  fotografiaPrincipalId = signal<string | null>(null);

  fotografias = signal<Fotografia[]>([]);

  fotografiasSeleccionadas = signal<FotografiaSeleccionada[]>([]);

  readonly fotografiaPrincipal = computed(() => {
    const principalId = this.fotografiaPrincipalId();

    if (!principalId) {
      return null;
    }

    return this.fotografias().find((fotografia) => String(fotografia.id) === principalId) ?? null;
  });

  readonly totalSeleccionadas = computed(() => this.fotografiasSeleccionadas().length);

  readonly totalPendientes = computed(
    () =>
      this.fotografiasSeleccionadas().filter(
        (fotografia) => fotografia.estado === 'PENDIENTE' || fotografia.estado === 'ERROR',
      ).length,
  );

  readonly totalCompletadas = computed(
    () =>
      this.fotografiasSeleccionadas().filter((fotografia) => fotografia.estado === 'COMPLETADA')
        .length,
  );

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(150)]],

    descripcion: ['', Validators.required],

    resenaHistorica: [''],

    fechaCreacion: [''],

    ubicacion: ['', [Validators.required, Validators.maxLength(255)]],

    latitud: [''],

    longitud: [''],

    fuentesInformacion: [''],

    observaciones: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del parque.');

      return;
    }

    this.parqueId = id;

    this.cargarParque(id);
    this.cargarFotografias(id);
  }

  private cargarParque(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.parquesService.getById(id).subscribe({
      next: (parque: Parque) => {
        this.estado.set(parque.estado);

        this.fotografiaPrincipalId.set(
          parque.fotografiaPrincipalId ? String(parque.fotografiaPrincipalId) : null,
        );

        this.form.patchValue({
          nombre: parque.nombre,

          descripcion: parque.descripcion,

          resenaHistorica: parque.resenaHistorica ?? '',

          fechaCreacion: parque.fechaCreacion ?? '',

          ubicacion: parque.ubicacion,

          latitud:
            parque.latitud !== null && parque.latitud !== undefined ? String(parque.latitud) : '',

          longitud:
            parque.longitud !== null && parque.longitud !== undefined
              ? String(parque.longitud)
              : '',

          fuentesInformacion: parque.fuentesInformacion ?? '',

          observaciones: parque.observaciones ?? '',
        });

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

  esFotografiaPrincipal(fotografia: Fotografia): boolean {
    return String(fotografia.id) === this.fotografiaPrincipalId();
  }

  cancelar(): void {
    this.router.navigate(['/parques', this.parqueId]);
  }

  guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const latitudTexto = String(value.latitud ?? '').trim();

    const longitudTexto = String(value.longitud ?? '').trim();

    const payload: UpdateParquePayload = {
      nombre: value.nombre.trim(),

      descripcion: value.descripcion.trim(),

      resenaHistorica: value.resenaHistorica.trim() || null,

      fechaCreacion: value.fechaCreacion || null,

      ubicacion: value.ubicacion.trim(),

      latitud: latitudTexto ? Number(latitudTexto) : null,

      longitud: longitudTexto ? Number(longitudTexto) : null,

      fuentesInformacion: value.fuentesInformacion.trim() || null,

      observaciones: value.observaciones.trim() || null,
    };

    this.saving.set(true);

    this.error.set('');
    this.success.set('');

    this.parquesService.update(this.parqueId, payload).subscribe({
      next: () => {
        this.parquesService.updateEstado(this.parqueId, this.estado()).subscribe({
          next: () => {
            this.saving.set(false);

            this.success.set('Parque actualizado correctamente.');

            this.router.navigate(['/parques', this.parqueId]);
          },

          error: (error) => {
            console.error('Error al actualizar estado del parque:', error);

            this.error.set(
              error?.error?.message ??
                'Los datos se actualizaron, pero no se pudo actualizar el estado.',
            );

            this.saving.set(false);
          },
        });
      },

      error: (error) => {
        console.error('Error al actualizar parque:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el parque.');

        this.saving.set(false);
      },
    });
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
      .upload('PARQUE', this.parqueId, fotografia.archivo, fotografia.descripcion.trim())
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
    }

    this.errorFotografias.set(
      `${errores} fotografía${errores === 1 ? '' : 's'} no ${
        errores === 1 ? 'pudo' : 'pudieron'
      } subirse. Puede volver a intentar las que fallaron.`,
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
    if (this.esFotografiaPrincipal(fotografia)) {
      return;
    }

    if (this.cambiandoPrincipal()) {
      return;
    }

    this.cambiandoPrincipal.set(true);

    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    this.fotografiasService.setPrincipal(fotografia.id).subscribe({
      next: () => {
        this.fotografiaPrincipalId.set(String(fotografia.id));

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
    if (this.esFotografiaPrincipal(fotografia)) {
      this.errorFotografias.set(
        'No se puede eliminar la fotografía principal. Primero establezca otra fotografía como principal.',
      );

      return;
    }

    if (this.eliminandoFotografia()) {
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
