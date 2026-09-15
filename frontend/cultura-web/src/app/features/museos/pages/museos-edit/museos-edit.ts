import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';
import {
  EstadoMuseo,
  Museo,
  MuseosService,
  UpdateMuseoPayload,
} from '../../../../core/services/museos.service';

@Component({
  selector: 'app-museos-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './museos-edit.html',
  styleUrl: './museos-edit.scss',
})
export class MuseosEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly museosService = inject(MuseosService);
  private readonly fotografiasService = inject(FotografiasService);

  museoId = '';

  loading = signal(false);
  saving = signal(false);
  error = signal('');
  success = signal('');

  estado = signal<EstadoMuseo>('BORRADOR');

  fotografias = signal<Fotografia[]>([]);
  fotografiaPrincipalId = signal<string | number | null>(null);

  archivoSeleccionado = signal<File | null>(null);
  descripcionFotografia = signal('');

  loadingFotografias = signal(false);
  subiendoFotografia = signal(false);
  cambiandoPrincipal = signal(false);
  eliminandoFotografia = signal(false);

  errorFotografias = signal('');
  mensajeFotografias = signal('');

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    descripcion: ['', Validators.required],
    resenaHistorica: [''],
    ubicacion: ['', [Validators.required, Validators.maxLength(255)]],
    horarioAtencion: [''],
    responsable: [''],
    sitioWeb: [''],
    latitud: [''],
    longitud: [''],
    fuentesInformacion: [''],
    observaciones: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del museo.');
      return;
    }

    this.museoId = id;

    this.cargarMuseo(id);
    this.cargarFotografias(id);
  }

  private cargarMuseo(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.museosService.getById(id).subscribe({
      next: (museo: Museo) => {
        this.estado.set(museo.estado);
        this.fotografiaPrincipalId.set(museo.fotografiaPrincipalId ?? null);

        this.form.patchValue({
          nombre: museo.nombre,
          descripcion: museo.descripcion,
          resenaHistorica: museo.resenaHistorica ?? '',
          ubicacion: museo.ubicacion,
          horarioAtencion: museo.horarioAtencion ?? '',
          responsable: museo.responsable ?? '',
          sitioWeb: museo.sitioWeb ?? '',
          latitud:
            museo.latitud !== null && museo.latitud !== undefined ? String(museo.latitud) : '',
          longitud:
            museo.longitud !== null && museo.longitud !== undefined ? String(museo.longitud) : '',
          fuentesInformacion: museo.fuentesInformacion ?? '',
          observaciones: museo.observaciones ?? '',
        });

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar museo:', error);

        this.error.set('No se pudo cargar la información del museo.');
        this.loading.set(false);
      },
    });
  }

  private cargarFotografias(id: string): void {
    this.loadingFotografias.set(true);
    this.errorFotografias.set('');

    this.fotografiasService.getAll('MUSEO', id).subscribe({
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
      .upload('MUSEO', this.museoId, file, this.descripcionFotografia())
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
    if (this.esFotografiaPrincipal(fotografia)) {
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
    if (this.esFotografiaPrincipal(fotografia)) {
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

    const payload: UpdateMuseoPayload = {
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim(),
      resenaHistorica: value.resenaHistorica.trim() || null,
      ubicacion: value.ubicacion.trim(),
      horarioAtencion: value.horarioAtencion.trim() || null,
      responsable: value.responsable.trim() || null,
      sitioWeb: value.sitioWeb.trim() || null,
      latitud: latitudTexto ? Number(latitudTexto) : null,
      longitud: longitudTexto ? Number(longitudTexto) : null,
      fuentesInformacion: value.fuentesInformacion.trim() || null,
      observaciones: value.observaciones.trim() || null,
    };

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    this.museosService.update(this.museoId, payload).subscribe({
      next: () => {
        this.museosService.updateEstado(this.museoId, this.estado()).subscribe({
          next: () => {
            this.saving.set(false);
            this.success.set('Museo actualizado correctamente.');

            this.router.navigate(['/museos', this.museoId]);
          },
          error: (error) => {
            console.error('Error al actualizar estado del museo:', error);

            this.error.set(
              error?.error?.message ??
                'Los datos se actualizaron, pero no se pudo actualizar el estado.',
            );

            this.saving.set(false);
          },
        });
      },
      error: (error) => {
        console.error('Error al actualizar museo:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el museo.');

        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/museos', this.museoId]);
  }
}
