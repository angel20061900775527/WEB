import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  CreateRioPayload,
  EstadoConservacionRio,
  RiosService,
  TipoRio,
} from '../../../../core/services/rios.service';

@Component({
  selector: 'app-rios-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rios-create.html',
  styleUrl: './rios-create.scss',
})
export class RiosCreate {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly riosService = inject(RiosService);

  saving = signal(false);
  error = signal('');

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

  guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const longitudKmTexto = String(value.longitudKm ?? '').trim();
    const latitudTexto = String(value.latitud ?? '').trim();
    const longitudTexto = String(value.longitud ?? '').trim();

    const payload: CreateRioPayload = {
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

    this.riosService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/rios']);
      },
      error: (error) => {
        console.error('Error al registrar río:', error);

        this.error.set(error?.error?.message ?? 'No se pudo registrar el río.');

        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/rios']);
  }
}
