import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';
import { Monumento, MonumentosService } from '../../../../core/services/monumentos.service';

@Component({
  selector: 'app-monumentos-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './monumentos-detail.html',
  styleUrl: './monumentos-detail.scss',
})
export class MonumentosDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly monumentosService = inject(MonumentosService);

  private readonly fotografiasService = inject(FotografiasService);

  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });

  monumento = signal<Monumento | null>(null);
  fotografias = signal<Fotografia[]>([]);

  loading = signal(false);
  loadingFotografias = signal(false);

  error = signal('');
  errorFotografias = signal('');

  readonly fotografiaPrincipal = computed(() => {
    const monumentoActual = this.monumento();

    if (!monumentoActual?.fotografiaPrincipalId) {
      return null;
    }

    return (
      this.fotografias().find(
        (foto) => String(foto.id) === String(monumentoActual.fotografiaPrincipalId),
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
      this.error.set('No se recibió el identificador del monumento.');
      return;
    }

    this.cargarMonumento(id);
    this.cargarFotografias(id);
  }

  private cargarMonumento(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.monumentosService.getById(id).subscribe({
      next: (monumento) => {
        this.monumento.set(monumento);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Error al cargar monumento:', error);

        this.error.set('No se pudo cargar la información del monumento.');

        this.loading.set(false);
      },
    });
  }

  private cargarFotografias(id: string): void {
    this.loadingFotografias.set(true);
    this.errorFotografias.set('');

    this.fotografiasService.getAll('MONUMENTO', id).subscribe({
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
    const monumentoActual = this.monumento();

    if (!monumentoActual) {
      return;
    }

    this.router.navigate(['/monumentos', monumentoActual.id, 'editar']);
  }
}
