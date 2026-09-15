import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';

import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';

import { Rio, RiosService } from '../../../../core/services/rios.service';

@Component({
  selector: 'app-rios-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './rios-detail.html',
  styleUrl: './rios-detail.scss',
})
export class RiosDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly riosService = inject(RiosService);

  private readonly fotografiasService = inject(FotografiasService);

  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });

  rio = signal<Rio | null>(null);
  fotografias = signal<Fotografia[]>([]);

  loading = signal(false);
  loadingFotografias = signal(false);

  error = signal('');
  errorFotografias = signal('');

  readonly fotografiaPrincipal = computed(() => {
    const rioActual = this.rio();

    if (!rioActual?.fotografiaPrincipalId) {
      return null;
    }

    return (
      this.fotografias().find(
        (foto) => String(foto.id) === String(rioActual.fotografiaPrincipalId),
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
      this.error.set('No se recibió el identificador del río.');
      return;
    }

    this.cargarRio(id);
    this.cargarFotografias(id);
  }

  private cargarRio(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.riosService.getById(id).subscribe({
      next: (rio) => {
        this.rio.set(rio);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error al cargar río:', error);

        this.error.set('No se pudo cargar la información del río.');

        this.loading.set(false);
      },
    });
  }

  private cargarFotografias(id: string): void {
    this.loadingFotografias.set(true);
    this.errorFotografias.set('');

    this.fotografiasService.getAll('RIO', id).subscribe({
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
    const rioActual = this.rio();

    if (!rioActual) {
      return;
    }

    this.router.navigate(['/rios', rioActual.id, 'editar']);
  }
}
