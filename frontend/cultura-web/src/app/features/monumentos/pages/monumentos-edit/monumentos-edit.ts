import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';

import {
  EstadoMonumento,
  Monumento,
  MonumentosService,
  UpdateMonumentoPayload,
} from '../../../../core/services/monumentos.service';

@Component({
  selector: 'app-monumentos-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './monumentos-edit.html',
  styleUrl: './monumentos-edit.scss',
})
export class MonumentosEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  private readonly monumentosService = inject(MonumentosService);

  private readonly fotografiasService = inject(FotografiasService);

  monumentoId = '';

  monumento = signal<Monumento | null>(null);
  fotografias = signal<Fotografia[]>([]);

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

  archivoSeleccionado = signal<File | null>(null);
  descripcionFotografia = signal('');

  estado = signal<EstadoMonumento>('BORRADOR');

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    descripcion: ['', Validators.required],
    tipo: [''],
    autor: [''],
    personajeHomenajeado: [''],
    resenaHistorica: [''],
    fechaConstruccion: [''],
    ubicacion: ['', [Validators.required, Validators.maxLength(255)]],
    latitud: [''],
    longitud: [''],
    fuentesInformacion: [''],
    observaciones: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del monumento.');
      return;
    }

    this.monumentoId = id;

    this.cargarMonumento(id);
    this.cargarFotografias(id);
  }

  private cargarMonumento(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.monumentosService.getById(id).subscribe({
      next: (monumento: Monumento) => {
        this.monumento.set(monumento);
        this.estado.set(monumento.estado);

        this.form.patchValue({
          nombre: monumento.nombre,
          descripcion: monumento.descripcion,
          tipo: monumento.tipo ?? '',
          autor: monumento.autor ?? '',
          personajeHomenajeado: monumento.personajeHomenajeado ?? '',
          resenaHistorica: monumento.resenaHistorica ?? '',
          fechaConstruccion: monumento.fechaConstruccion ?? '',
          ubicacion: monumento.ubicacion,

          latitud:
            monumento.latitud !== null && monumento.latitud !== undefined
              ? String(monumento.latitud)
              : '',

          longitud:
            monumento.longitud !== null && monumento.longitud !== undefined
              ? String(monumento.longitud)
              : '',

          fuentesInformacion: monumento.fuentesInformacion ?? '',

          observaciones: monumento.observaciones ?? '',
        });

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

  esPrincipal(fotografia: Fotografia): boolean {
    const monumentoActual = this.monumento();

    if (!monumentoActual?.fotografiaPrincipalId) {
      return false;
    }

    return String(monumentoActual.fotografiaPrincipalId) === String(fotografia.id);
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
    const file = this.archivoSeleccionado();

    if (!file) {
      this.errorFotografias.set('Seleccione una imagen antes de continuar.');
      return;
    }

    this.subiendoFotografia.set(true);
    this.errorFotografias.set('');
    this.mensajeFotografias.set('');

    this.fotografiasService
      .upload('MONUMENTO', this.monumentoId, file, this.descripcionFotografia())
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
    if (this.esPrincipal(fotografia)) {
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

    const latitudTexto = String(value.latitud ?? '').trim();

    const longitudTexto = String(value.longitud ?? '').trim();

    const payload: UpdateMonumentoPayload = {
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim(),
      tipo: value.tipo.trim() || null,
      autor: value.autor.trim() || null,

      personajeHomenajeado: value.personajeHomenajeado.trim() || null,

      resenaHistorica: value.resenaHistorica.trim() || null,

      fechaConstruccion: value.fechaConstruccion || null,

      ubicacion: value.ubicacion.trim(),

      latitud: latitudTexto ? Number(latitudTexto) : null,

      longitud: longitudTexto ? Number(longitudTexto) : null,

      fuentesInformacion: value.fuentesInformacion.trim() || null,

      observaciones: value.observaciones.trim() || null,
    };

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    this.monumentosService.update(this.monumentoId, payload).subscribe({
      next: () => {
        this.monumentosService.updateEstado(this.monumentoId, this.estado()).subscribe({
          next: () => {
            this.saving.set(false);

            this.success.set('Monumento actualizado correctamente.');

            this.router.navigate(['/monumentos', this.monumentoId]);
          },

          error: (error) => {
            console.error('Error al actualizar estado del monumento:', error);

            this.error.set(
              error?.error?.message ??
                'Los datos se actualizaron, pero no se pudo actualizar el estado.',
            );

            this.saving.set(false);
          },
        });
      },

      error: (error) => {
        console.error('Error al actualizar monumento:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el monumento.');

        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/monumentos', this.monumentoId]);
  }
}
