import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  CallesService,
  CreateCallePayload,
  EstadoCalle,
} from '../../../../core/services/calles.service';

@Component({
  selector: 'app-calles-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calles-create.html',
  styleUrl: './calles-create.scss',
})
export class CallesCreate {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly callesService = inject(CallesService);

  saving = signal(false);
  error = signal('');
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

  guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const latitudTexto = String(value.latitud ?? '').trim();
    const longitudTexto = String(value.longitud ?? '').trim();

    const payload: CreateCallePayload = {
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

    this.callesService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/calles']);
      },
      error: (error) => {
        console.error('Error al registrar calle:', error);

        this.error.set(error?.error?.message ?? 'No se pudo registrar la calle.');

        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/calles']);
  }
}
