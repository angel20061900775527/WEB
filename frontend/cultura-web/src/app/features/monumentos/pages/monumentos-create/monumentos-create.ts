import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  CreateMonumentoPayload,
  EstadoMonumento,
  MonumentosService,
} from '../../../../core/services/monumentos.service';

@Component({
  selector: 'app-monumentos-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './monumentos-create.html',
  styleUrl: './monumentos-create.scss',
})
export class MonumentosCreate {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly monumentosService = inject(MonumentosService);

  saving = signal(false);
  error = signal('');
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

  guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const latitudTexto = String(value.latitud ?? '').trim();
    const longitudTexto = String(value.longitud ?? '').trim();

    const payload: CreateMonumentoPayload = {
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

    this.monumentosService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/monumentos']);
      },
      error: (error) => {
        console.error('Error al registrar monumento:', error);

        this.error.set(error?.error?.message ?? 'No se pudo registrar el monumento.');

        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/monumentos']);
  }
}
