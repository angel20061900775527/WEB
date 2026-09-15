import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';
import { Calle, CallesService } from '../../../../core/services/calles.service';

@Component({
  selector: 'app-calles-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './calles-detail.html',
  styleUrl: './calles-detail.scss',
})
export class CallesDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly callesService = inject(CallesService);
  private readonly fotografiasService = inject(FotografiasService);
  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });

  calle = signal<Calle | null>(null);
  fotografias = signal<Fotografia[]>([]);

  loading = signal(false);
  loadingFotografias = signal(false);

  error = signal('');
  errorFotografias = signal('');

  readonly fotografiaPrincipal = computed(() => {
    const calleActual = this.calle();

    if (!calleActual?.fotografiaPrincipalId) {
      return null;
    }

    return (
      this.fotografias().find(
        (foto) => String(foto.id) === String(calleActual.fotografiaPrincipalId),
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
      this.error.set('No se recibió el identificador de la calle.');
      return;
    }

    this.cargarCalle(id);
    this.cargarFotografias(id);
  }

  private cargarCalle(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.callesService.getById(id).subscribe({
      next: (calle) => {
        this.calle.set(calle);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error al cargar calle:', error);

        this.error.set('No se pudo cargar la información de la calle.');

        this.loading.set(false);
      },
    });
  }

  private cargarFotografias(id: string): void {
    this.loadingFotografias.set(true);
    this.errorFotografias.set('');

    this.fotografiasService.getAll('CALLE', id).subscribe({
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
    const calleActual = this.calle();

    if (!calleActual) {
      return;
    }

    this.router.navigate(['/calles', calleActual.id, 'editar']);
  }
}
