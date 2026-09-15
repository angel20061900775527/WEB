import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';

import {
  EstadoPlaza,
  Plaza,
  PlazasService,
  UpdatePlazaPayload,
} from '../../../../core/services/plazas.service';

interface FotografiaSeleccionada {
  id: number;
  archivo: File;
  descripcion: string;
  estado: 'PENDIENTE' | 'SUBIENDO' | 'COMPLETADA' | 'ERROR';
  error?: string;
}

@Component({
  selector: 'app-plazas-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './plazas-edit.html',
  styleUrl: './plazas-edit.scss',
})
export class PlazasEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly plazasService = inject(PlazasService);
  private readonly fotografiasService = inject(FotografiasService);

  private siguienteFotografiaId = 1;

  plazaId = '';

  loading = signal(false);
  saving = signal(false);

  error = signal('');
  success = signal('');

  estado = signal<EstadoPlaza>('BORRADOR');

  fotografias = signal<Fotografia[]>([]);
  fotografiasSeleccionadas = signal<FotografiaSeleccionada[]>([]);

  loadingFotografias = signal(false);
  errorFotografias = signal('');
  mensajeFotografias = signal('');

  cambiandoPrincipal = signal(false);
  eliminandoFotografia = signal(false);
  subiendoFotografias = signal(false);

  fotografiaPrincipalId = signal<string | number | null>(null);

  readonly totalPendientes = computed(
    () =>
      this.fotografiasSeleccionadas().filter(
        (item) => item.estado === 'PENDIENTE' || item.estado === 'ERROR',
      ).length,
  );

  readonly fotografiaPrincipal = computed(() => {
    const principalId = this.fotografiaPrincipalId();

    if (principalId === null || principalId === undefined) {
      return null;
    }

    return this.fotografias().find((foto) => String(foto.id) === String(principalId)) ?? null;
  });

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
      this.error.set('No se recibió el identificador de la plaza.');
      return;
    }

    this.plazaId = id;

    this.cargarPlaza(id);
    this.cargarFotografias(id);
  }

  private cargarPlaza(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.plazasService.getById(id).subscribe({
      next: (plaza: Plaza) => {
        this.estado.set(plaza.estado);

        this.fotografiaPrincipalId.set(plaza.fotografiaPrincipalId ?? null);

        this.form.patchValue({
          nombre: plaza.nombre,
          descripcion: plaza.descripcion,
          resenaHistorica: plaza.resenaHistorica ?? '',
          fechaCreacion: plaza.fechaCreacion ?? '',
          ubicacion: plaza.ubicacion,

          latitud:
            plaza.latitud !== null && plaza.latitud !== undefined ? String(plaza.latitud) : '',

          longitud:
            plaza.longitud !== null && plaza.longitud !== undefined ? String(plaza.longitud) : '',

          fuentesInformacion: plaza.fuentesInformacion ?? '',

          observaciones: plaza.observaciones ?? '',
        });

        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error al cargar plaza:', error);

        this.error.set('No se pudo cargar la información de la plaza.');

        this.loading.set(false);
      },
    });
  }

  private cargarFotografias(id: string): void {
    this.loadingFotografias.set(true);
    this.errorFotografias.set('');

    this.fotografiasService.getAll('PLAZA', id).subscribe({
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
    const principalId = this.fotografiaPrincipalId();

    if (principalId === null || principalId === undefined) {
      return false;
    }

    return String(principalId) === String(fotografia.id);
  }

  guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const latitudTexto = String(value.latitud ?? '').trim();

    const longitudTexto = String(value.longitud ?? '').trim();

    const payload: UpdatePlazaPayload = {
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

    this.plazasService.update(this.plazaId, payload).subscribe({
      next: () => {
        this.plazasService.updateEstado(this.plazaId, this.estado()).subscribe({
          next: () => {
            this.saving.set(false);

            this.success.set('Plaza actualizada correctamente.');

            this.router.navigate(['/plazas', this.plazaId]);
          },

          error: (error) => {
            console.error('Error al actualizar estado de la plaza:', error);

            this.error.set(
              error?.error?.message ??
                'Los datos se actualizaron, pero no se pudo actualizar el estado.',
            );

            this.saving.set(false);
          },
        });
      },

      error: (error) => {
        console.error('Error al actualizar plaza:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar la plaza.');

        this.saving.set(false);
      },
    });
  }

  seleccionarFotografias(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivos = Array.from(input.files ?? []);

    if (archivos.length === 0) {
      return;
    }

    const nuevas: FotografiaSeleccionada[] = archivos.map((archivo) => ({
      id: this.siguienteFotografiaId++,
      archivo,
      descripcion: '',
      estado: 'PENDIENTE',
    }));

    this.fotografiasSeleccionadas.update((actuales) => [...actuales, ...nuevas]);

    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    input.value = '';
  }

  actualizarDescripcionFotografia(id: number, descripcion: string): void {
    this.fotografiasSeleccionadas.update((fotografias) =>
      fotografias.map((item) =>
        item.id === id
          ? {
              ...item,
              descripcion,
            }
          : item,
      ),
    );
  }

  quitarFotografiaSeleccionada(id: number): void {
    if (this.subiendoFotografias()) {
      return;
    }

    this.fotografiasSeleccionadas.update((fotografias) =>
      fotografias.filter((item) => item.id !== id),
    );

    this.errorFotografias.set('');
    this.mensajeFotografias.set('');
  }

  limpiarSeleccion(): void {
    if (this.subiendoFotografias()) {
      return;
    }

    this.fotografiasSeleccionadas.set([]);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');
  }

  subirFotografias(): void {
    if (this.subiendoFotografias()) {
      return;
    }

    const pendientes = this.fotografiasSeleccionadas().filter(
      (item) => item.estado === 'PENDIENTE' || item.estado === 'ERROR',
    );

    if (pendientes.length === 0) {
      return;
    }

    this.subiendoFotografias.set(true);
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

    this.actualizarEstadoFotografia(fotografia.id, 'SUBIENDO');

    this.fotografiasService
      .upload('PLAZA', this.plazaId, fotografia.archivo, fotografia.descripcion.trim())
      .subscribe({
        next: (fotografiaCreada) => {
          this.fotografias.update((fotografias) => [fotografiaCreada, ...fotografias]);

          this.actualizarEstadoFotografia(fotografia.id, 'COMPLETADA');

          this.subirSiguienteFotografia(pendientes, indice + 1, completadas + 1, errores);
        },

        error: (error) => {
          console.error('Error al subir fotografía:', error);

          this.actualizarEstadoFotografia(
            fotografia.id,
            'ERROR',
            error?.error?.message ?? 'No se pudo subir la fotografía.',
          );

          this.subirSiguienteFotografia(pendientes, indice + 1, completadas, errores + 1);
        },
      });
  }

  private finalizarCargaFotografias(completadas: number, errores: number): void {
    this.subiendoFotografias.set(false);

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

  private actualizarEstadoFotografia(
    id: number,
    estado: FotografiaSeleccionada['estado'],
    error?: string,
  ): void {
    this.fotografiasSeleccionadas.update((fotografias) =>
      fotografias.map((item) =>
        item.id === id
          ? {
              ...item,
              estado,
              error,
            }
          : item,
      ),
    );
  }

  establecerPrincipal(fotografia: Fotografia): void {
    if (String(this.fotografiaPrincipalId()) === String(fotografia.id)) {
      return;
    }

    this.cambiandoPrincipal.set(true);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    this.fotografiasService.setPrincipal(fotografia.id).subscribe({
      next: () => {
        this.fotografiaPrincipalId.set(fotografia.id);

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
    if (String(this.fotografiaPrincipalId()) === String(fotografia.id)) {
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

  cancelar(): void {
    this.router.navigate(['/plazas', this.plazaId]);
  }
}
