import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';
import { Plaza, PlazasService } from '../../../../core/services/plazas.service';

@Component({
  selector: 'app-plazas-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './plazas-detail.html',
  styleUrl: './plazas-detail.scss',
})
export class PlazasDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly plazasService = inject(PlazasService);
  private readonly fotografiasService = inject(FotografiasService);
  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });

  plaza = signal<Plaza | null>(null);
  fotografias = signal<Fotografia[]>([]);

  loading = signal(false);
  loadingFotografias = signal(false);

  error = signal('');
  errorFotografias = signal('');

  readonly fotografiaPrincipal = computed(() => {
    const plazaActual = this.plaza();

    if (!plazaActual?.fotografiaPrincipalId) {
      return null;
    }

    return (
      this.fotografias().find(
        (foto) => String(foto.id) === String(plazaActual.fotografiaPrincipalId),
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
      this.error.set('No se recibió el identificador de la plaza.');
      return;
    }

    this.cargarPlaza(id);
    this.cargarFotografias(id);
  }

  private cargarPlaza(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.plazasService.getById(id).subscribe({
      next: (plaza) => {
        this.plaza.set(plaza);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar plaza:', error);

        this.error.set('No se pudo cargar la información de la plaza.');

        this.loading.set(false);
      },
    });
  }

  private cargarFotografias(id: string): void {
    this.loadingFotografias.set(true);
    this.errorFotografias.set('');

    this.fotografiasService.getAll('PLAZA', id).subscribe({
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
    const plazaActual = this.plaza();

    if (!plazaActual) {
      return;
    }

    this.router.navigate(['/plazas', plazaActual.id, 'editar']);
  }
}
