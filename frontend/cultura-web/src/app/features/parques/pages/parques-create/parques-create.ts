import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  CreateParquePayload,EstadoParque,
  ParquesService,
} from '../../../../core/services/parques.service';

@Component({
  selector: 'app-parques-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './parques-create.html',
  styleUrl: './parques-create.scss',
})

export class ParquesCreate {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly parquesService = inject(ParquesService);

  saving = signal(false);
  error = signal('');
  estado = signal<EstadoParque>('BORRADOR');

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

  cancelar(): void {
    this.router.navigate(['/parques']);
  }
  guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const latitudTexto = String(value.latitud ?? '').trim();
    const longitudTexto = String(value.longitud ?? '').trim();

    const payload: CreateParquePayload = {
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

    this.parquesService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/parques']);
      },
      error: (error) => {
        console.error('Error al registrar parque:', error);

        this.error.set(error?.error?.message ?? 'No se pudo registrar el parque.');

        this.saving.set(false);
      },
    });
  }
}
