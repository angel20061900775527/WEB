import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  EstadoPlaza,
  Plaza,
  PlazasService,
  UpdatePlazaPayload,
} from '../../../../core/services/plazas.service';

@Component({
  selector: 'app-plazas-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './plazas-edit.html',
  styleUrl: './plazas-edit.scss',
})
export class PlazasEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly plazasService = inject(PlazasService);

  plazaId = '';

  loading = signal(false);
  saving = signal(false);
  error = signal('');
  success = signal('');

  estado = signal<EstadoPlaza>('BORRADOR');

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
      this.error.set('No se recibió el identificador de la plaza.');
      return;
    }

    this.plazaId = id;
    this.cargarPlaza(id);
  }

  private cargarPlaza(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.plazasService.getById(id).subscribe({
      next: (plaza: Plaza) => {
        this.estado.set(plaza.estado);

        this.form.patchValue({
          nombre: plaza.nombre,
          descripcion: plaza.descripcion,
          resenaHistorica: plaza.resenaHistorica ?? '',
          fechaCreacion: plaza.fechaCreacion ?? '',
          ubicacion: plaza.ubicacion,
          latitud:
            plaza.latitud !== null && plaza.latitud !== undefined ? String(plaza.latitud) : '',
          longitud:
            plaza.longitud !== null && plaza.longitud !== undefined ? String(plaza.longitud) : '',
          fuentesInformacion: plaza.fuentesInformacion ?? '',
          observaciones: plaza.observaciones ?? '',
        });

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar plaza:', error);

        this.error.set('No se pudo cargar la información de la plaza.');

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

    const payload: UpdatePlazaPayload = {
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

    this.plazasService.update(this.plazaId, payload).subscribe({
      next: () => {
        this.plazasService.updateEstado(this.plazaId, this.estado()).subscribe({
          next: () => {
            this.saving.set(false);

            this.success.set('Plaza actualizada correctamente.');

            this.router.navigate(['/plazas', this.plazaId]);
          },
          error: (error) => {
            console.error('Error al actualizar estado de la plaza:', error);

            this.error.set(
              error?.error?.message ??
                'Los datos se actualizaron, pero no se pudo actualizar el estado.',
            );

            this.saving.set(false);
          },
        });
      },
      error: (error) => {
        console.error('Error al actualizar plaza:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar la plaza.');

        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/plazas', this.plazaId]);
  }
}
