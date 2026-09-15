import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { Fotografia, FotografiasService } from '../../../../core/services/fotografias.service';
import { Museo, MuseosService } from '../../../../core/services/museos.service';

@Component({
  selector: 'app-museos-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './museos-detail.html',
  styleUrl: './museos-detail.scss',
})
export class MuseosDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly museosService = inject(MuseosService);
  private readonly fotografiasService = inject(FotografiasService);
  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });

  museo = signal<Museo | null>(null);
  fotografias = signal<Fotografia[]>([]);

  loading = signal(false);
  loadingFotografias = signal(false);

  error = signal('');
  errorFotografias = signal('');

  readonly fotografiaPrincipal = computed(() => {
    const museoActual = this.museo();

    if (!museoActual?.fotografiaPrincipalId) {
      return null;
    }

    return (
      this.fotografias().find(
        (foto) => String(foto.id) === String(museoActual.fotografiaPrincipalId),
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
      this.error.set('No se recibió el identificador del museo.');
      return;
    }

    this.cargarMuseo(id);
    this.cargarFotografias(id);
  }

  private cargarMuseo(id: string): void {
    this.loading.set(true);
    this.error.set('');

    this.museosService.getById(id).subscribe({
      next: (museo) => {
        this.museo.set(museo);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar museo:', error);

        this.error.set('No se pudo cargar la información del museo.');
        this.loading.set(false);
      },
    });
  }

  private cargarFotografias(id: string): void {
    this.loadingFotografias.set(true);
    this.errorFotografias.set('');

    this.fotografiasService.getAll('MUSEO', id).subscribe({
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
    const museoActual = this.museo();

    if (!museoActual) {
      return;
    }

    this.router.navigate(['/museos', museoActual.id, 'editar']);
  }
}
