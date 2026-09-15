import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';
import { Auditorio, AuditoriosService } from '../../../../core/services/auditorios.service';

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
  private readonly fotografiasService = inject(FotografiasService);
  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });

  auditorio = signal<Auditorio | null>(null);
  fotografias = signal<Fotografia[]>([]);

  loading = signal(false);
  loadingFotografias = signal(false);

  error = signal('');
  errorFotografias = signal('');

  readonly fotografiaPrincipal = computed(() => {
    const auditorioActual = this.auditorio();

    if (!auditorioActual?.fotografiaPrincipalId) {
      return null;
    }

    return (
      this.fotografias().find(
        (foto) => String(foto.id) === String(auditorioActual.fotografiaPrincipalId),
      ) ?? null
    );
  });

  readonly fotografiasSecundarias = computed(() => {
    const principal = this.fotografiaPrincipal();

    if (!principal) {
      return this.fotografias();
    }

    return this.fotografias().filter((foto) => String(foto.id) !== String(principal.id));
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se recibió el identificador del auditorio.');
      return;
    }

    this.cargarAuditorio(id);
    this.cargarFotografias(id);
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

  private cargarFotografias(id: string): void {
    this.loadingFotografias.set(true);
    this.errorFotografias.set('');

    this.fotografiasService.getAll('AUDITORIO', id).subscribe({
      next: (fotografias) => {
        this.fotografias.set(fotografias);
        this.loadingFotografias.set(false);
      },
      error: (error) => {
        console.error('Error al cargar fotografías:', error);

        this.errorFotografias.set(
          error?.error?.message ?? 'No se pudieron cargar las fotografías.',
        );

        this.loadingFotografias.set(false);
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
}
