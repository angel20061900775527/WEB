import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import {
  Auditorio,
  AuditoriosService,
  EstadoAuditorio,
} from '../../../../core/services/auditorios.service';

@Component({
  selector: 'app-auditorios-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './auditorios-detail.html',
  styleUrl: './auditorios-detail.scss',
})
export class AuditoriosDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auditoriosService = inject(AuditoriosService);
  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });

  auditorio = signal<Auditorio | null>(null);

  loading = signal(false);
  error = signal('');

  cambiandoEstado = signal(false);
  mensajeEstado = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del auditorio.');
      return;
    }

    this.cargarAuditorio(id);
  }

  private cargarAuditorio(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.auditoriosService.getById(id).subscribe({
      next: (auditorio) => {
        this.auditorio.set(auditorio);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar auditorio:', error);

        this.error.set('No se pudo cargar la información del auditorio.');

        this.loading.set(false);
      },
    });
  }

  editar(): void {
    const auditorioActual = this.auditorio();

    if (!auditorioActual) {
      return;
    }

    this.router.navigate(['/auditorios', auditorioActual.id, 'editar']);
  }

  cambiarEstado(estado: EstadoAuditorio): void {
    const auditorioActual = this.auditorio();

    if (!auditorioActual || auditorioActual.estado === estado) {
      return;
    }

    this.cambiandoEstado.set(true);
    this.error.set('');
    this.mensajeEstado.set('');

    this.auditoriosService.updateEstado(auditorioActual.id, estado).subscribe({
      next: () => {
        this.auditorio.update((auditorio) =>
          auditorio
            ? {
                ...auditorio,
                estado,
              }
            : null,
        );

        this.mensajeEstado.set('Estado actualizado correctamente.');

        this.cambiandoEstado.set(false);
      },
      error: (error) => {
        console.error('Error al cambiar estado del auditorio:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el estado del auditorio.');

        this.cambiandoEstado.set(false);
      },
    });
  }
}
