import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Calle,
  CallesService,
  EstadoCalle,
  UpdateCallePayload,
} from '../../../../core/services/calles.service';

@Component({
  selector: 'app-calles-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calles-edit.html',
  styleUrl: './calles-edit.scss',
})
export class CallesEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly callesService = inject(CallesService);

  calleId = '';

  loading = signal(false);
  saving = signal(false);
  error = signal('');
  success = signal('');

  estado = signal<EstadoCalle>('BORRADOR');

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    descripcion: ['', Validators.required],
    resenaHistorica: [''],
    fechaDenominacion: [''],
    ubicacion: ['', [Validators.required, Validators.maxLength(255)]],
    sector: [''],
    latitud: [''],
    longitud: [''],
    fuentesInformacion: [''],
    observaciones: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador de la calle.');
      return;
    }

    this.calleId = id;
    this.cargarCalle(id);
  }

  private cargarCalle(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.callesService.getById(id).subscribe({
      next: (calle: Calle) => {
        this.estado.set(calle.estado);

        this.form.patchValue({
          nombre: calle.nombre,
          descripcion: calle.descripcion,
          resenaHistorica: calle.resenaHistorica ?? '',
          fechaDenominacion: calle.fechaDenominacion ?? '',
          ubicacion: calle.ubicacion,
          sector: calle.sector ?? '',
          latitud:
            calle.latitud !== null && calle.latitud !== undefined ? String(calle.latitud) : '',
          longitud:
            calle.longitud !== null && calle.longitud !== undefined ? String(calle.longitud) : '',
          fuentesInformacion: calle.fuentesInformacion ?? '',
          observaciones: calle.observaciones ?? '',
        });

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar calle:', error);

        this.error.set('No se pudo cargar la información de la calle.');

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

    const payload: UpdateCallePayload = {
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim(),
      resenaHistorica: value.resenaHistorica.trim() || null,
      fechaDenominacion: value.fechaDenominacion || null,
      ubicacion: value.ubicacion.trim(),
      sector: value.sector.trim() || null,
      latitud: latitudTexto ? Number(latitudTexto) : null,
      longitud: longitudTexto ? Number(longitudTexto) : null,
      fuentesInformacion: value.fuentesInformacion.trim() || null,
      observaciones: value.observaciones.trim() || null,
    };

    this.saving.set(true);
    this.error.set('');
    this.success.set('');

    this.callesService.update(this.calleId, payload).subscribe({
      next: () => {
        this.callesService.updateEstado(this.calleId, this.estado()).subscribe({
          next: () => {
            this.saving.set(false);
            this.success.set('Calle actualizada correctamente.');

            this.router.navigate(['/calles', this.calleId]);
          },
          error: (error) => {
            console.error('Error al actualizar estado de la calle:', error);

            this.error.set(
              error?.error?.message ??
                'Los datos se actualizaron, pero no se pudo actualizar el estado.',
            );

            this.saving.set(false);
          },
        });
      },
      error: (error) => {
        console.error('Error al actualizar calle:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar la calle.');

        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/calles', this.calleId]);
  }
}
