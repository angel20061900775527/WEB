import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Auditorio,
  AuditoriosService,
  EstadoAuditorio,
  UpdateAuditorioPayload,
} from '../../../../core/services/auditorios.service';

@Component({
  selector: 'app-auditorios-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auditorios-edit.html',
  styleUrl: './auditorios-edit.scss',
})
export class AuditoriosEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly auditoriosService = inject(AuditoriosService);

  auditorioId = '';

  loading = signal(false);
  saving = signal(false);
  error = signal('');
  success = signal('');

  estado = signal<EstadoAuditorio>('BORRADOR');

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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del auditorio.');
      return;
    }

    this.auditorioId = id;
    this.cargarAuditorio(id);
  }

  private cargarAuditorio(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.auditoriosService.getById(id).subscribe({
      next: (auditorio: Auditorio) => {
        this.estado.set(auditorio.estado);

        this.form.patchValue({
          nombre: auditorio.nombre,
          descripcion: auditorio.descripcion,
          resenaHistorica: auditorio.resenaHistorica ?? '',
          ubicacion: auditorio.ubicacion,
          horarioAtencion: auditorio.horarioAtencion ?? '',
          responsable: auditorio.responsable ?? '',
          sitioWeb: auditorio.sitioWeb ?? '',
          latitud:
            auditorio.latitud !== null && auditorio.latitud !== undefined
              ? String(auditorio.latitud)
              : '',
          longitud:
            auditorio.longitud !== null && auditorio.longitud !== undefined
              ? String(auditorio.longitud)
              : '',
          fuentesInformacion: auditorio.fuentesInformacion ?? '',
          observaciones: auditorio.observaciones ?? '',
        });

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar auditorio:', error);

        this.error.set('No se pudo cargar la información del auditorio.');

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

    const payload: UpdateAuditorioPayload = {
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
    this.success.set('');

    this.auditoriosService.update(this.auditorioId, payload).subscribe({
      next: () => {
        this.auditoriosService.updateEstado(this.auditorioId, this.estado()).subscribe({
          next: () => {
            this.saving.set(false);

            this.success.set('Auditorio actualizado correctamente.');

            this.router.navigate(['/auditorios', this.auditorioId]);
          },
          error: (error) => {
            console.error('Error al actualizar estado del auditorio:', error);

            this.error.set(
              error?.error?.message ??
                'Los datos se actualizaron, pero no se pudo actualizar el estado.',
            );

            this.saving.set(false);
          },
        });
      },
      error: (error) => {
        console.error('Error al actualizar auditorio:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el auditorio.');

        this.saving.set(false);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/auditorios', this.auditorioId]);
  }
}
