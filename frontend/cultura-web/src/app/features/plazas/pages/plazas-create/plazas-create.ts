import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CreatePlazaPayload, PlazasService } from '../../../../core/services/plazas.service';

@Component({
  selector: 'app-plazas-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './plazas-create.html',
  styleUrl: './plazas-create.scss',
})
export class PlazasCreate {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly plazasService = inject(PlazasService);

  saving = signal(false);
  error = signal('');

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

  guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const latitudTexto = String(value.latitud ?? '').trim();
    const longitudTexto = String(value.longitud ?? '').trim();

    const payload: CreatePlazaPayload = {
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

    this.plazasService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/plazas']);
      },
      error: (error) => {
        console.error('Error al registrar plaza:', error);

        this.error.set(error?.error?.message ?? 'No se pudo registrar la plaza.');

        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/plazas']);
  }
}
