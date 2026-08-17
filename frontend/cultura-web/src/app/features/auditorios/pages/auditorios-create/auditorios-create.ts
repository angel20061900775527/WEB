import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  AuditoriosService,
  CreateAuditorioPayload,
} from '../../../../core/services/auditorios.service';

@Component({
  selector: 'app-auditorios-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auditorios-create.html',
  styleUrl: './auditorios-create.scss',
})
export class AuditoriosCreate {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly auditoriosService = inject(AuditoriosService);

  saving = signal(false);
  error = signal('');

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

  guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const latitudTexto = String(value.latitud ?? '').trim();
    const longitudTexto = String(value.longitud ?? '').trim();

    const payload: CreateAuditorioPayload = {
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

    this.auditoriosService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/auditorios']);
      },
      error: (error) => {
        console.error('Error al registrar auditorio:', error);

        this.error.set(error?.error?.message ?? 'No se pudo registrar el auditorio.');

        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/auditorios']);
  }
}
