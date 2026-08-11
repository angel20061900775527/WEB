import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  EstadoParque,
  Parque,
  ParquesService,
  UpdateParquePayload,
} from '../../../../core/services/parques.service';

@Component({
  selector: 'app-parques-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './parques-edit.html',
  styleUrl: './parques-edit.scss',
})
export class ParquesEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly parquesService = inject(ParquesService);

  parqueId = '';
  loading = signal(false);
  error = signal('');
  saving = signal(false);
  success = signal('');
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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del parque.');
      return;
    }

    this.parqueId = id;
    this.cargarParque(id);
  }

  private cargarParque(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.parquesService.getById(id).subscribe({
      next: (parque: Parque) => {
        this.estado.set(parque.estado);
        this.form.patchValue({
          nombre: parque.nombre,
          descripcion: parque.descripcion,
          resenaHistorica: parque.resenaHistorica ?? '',
          fechaCreacion: parque.fechaCreacion ?? '',
          ubicacion: parque.ubicacion,
          latitud:
            parque.latitud !== null && parque.latitud !== undefined ? String(parque.latitud) : '',
          longitud:
            parque.longitud !== null && parque.longitud !== undefined
              ? String(parque.longitud)
              : '',
          fuentesInformacion: parque.fuentesInformacion ?? '',
          observaciones: parque.observaciones ?? '',
        });

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar parque:', error);
        this.error.set('No se pudo cargar la información del parque.');
        this.loading.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/parques', this.parqueId]);
  }
  guardar(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const latitudTexto = String(value.latitud ?? '').trim();
    const longitudTexto = String(value.longitud ?? '').trim();

    const payload: UpdateParquePayload = {
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
    this.success.set('');

    this.parquesService.update(this.parqueId, payload).subscribe({
      next: () => {
        this.parquesService.updateEstado(this.parqueId, this.estado()).subscribe({
          next: () => {
            this.saving.set(false);
            this.success.set('Parque actualizado correctamente.');

            this.router.navigate(['/parques', this.parqueId]);
          },
          error: (error) => {
            console.error('Error al actualizar estado del parque:', error);

            this.error.set(
              error?.error?.message ??
                'Los datos se actualizaron, pero no se pudo actualizar el estado.',
            );

            this.saving.set(false);
          },
        });
      },
      error: (error) => {
        console.error('Error al actualizar parque:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el parque.');

        this.saving.set(false);
      },
    });
  }
}
