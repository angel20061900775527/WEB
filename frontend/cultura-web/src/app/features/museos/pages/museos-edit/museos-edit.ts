import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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

  museoId = '';

  loading = signal(false);
  saving = signal(false);
  error = signal('');
  success = signal('');

  estado = signal<EstadoMuseo>('BORRADOR');

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
  }

  private cargarMuseo(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.museosService.getById(id).subscribe({
      next: (museo: Museo) => {
        this.estado.set(museo.estado);

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
