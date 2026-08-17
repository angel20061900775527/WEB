import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  EstadoMonumento,
  Monumento,
  MonumentosService,
  UpdateMonumentoPayload,
} from '../../../../core/services/monumentos.service';

@Component({
  selector: 'app-monumentos-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './monumentos-edit.html',
  styleUrl: './monumentos-edit.scss',
})
export class MonumentosEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly monumentosService = inject(MonumentosService);

  monumentoId = '';

  loading = signal(false);
  saving = signal(false);
  error = signal('');
  success = signal('');

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
  }

  private cargarMonumento(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.monumentosService.getById(id).subscribe({
      next: (monumento: Monumento) => {
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
