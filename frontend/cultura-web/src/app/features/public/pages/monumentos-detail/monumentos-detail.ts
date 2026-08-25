import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Fotografia } from '../../../../core/services/fotografias.service';
import { FotografiasPublicService } from '../../../../core/services/fotografias-public.service';
import { Monumento } from '../../../../core/services/monumentos.service';
import { MonumentosPublicService } from '../../../../core/services/monumentos-public.service';

@Component({
  selector: 'app-public-monumentos-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './monumentos-detail.html',
  styleUrl: './monumentos-detail.scss',
})
export class MonumentosDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly monumentosService = inject(MonumentosPublicService);
  private readonly fotografiasService = inject(FotografiasPublicService);

  readonly monumento = signal<Monumento | null>(null);
  readonly fotografias = signal<Fotografia[]>([]);

  readonly cargando = signal(false);
  readonly cargandoFotografias = signal(false);

  readonly error = signal<string | null>(null);
  readonly errorFotografias = signal<string | null>(null);

  readonly fotografiaPrincipal = computed(() => {
    const monumento = this.monumento();
    const fotografias = this.fotografias();

    if (!monumento || fotografias.length === 0) {
      return null;
    }

    if (monumento.fotografiaPrincipalId) {
      const principal = fotografias.find(
        (fotografia) => String(fotografia.id) === String(monumento.fotografiaPrincipalId),
      );

      if (principal) {
        return principal;
      }
    }

    return fotografias[0] ?? null;
  });

  readonly fotografiasSecundarias = computed(() => {
    const principal = this.fotografiaPrincipal();

    if (!principal) {
      return this.fotografias();
    }

    return this.fotografias().filter(
      (fotografia) => String(fotografia.id) !== String(principal.id),
    );
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se encontró el monumento solicitado.');
      return;
    }

    this.cargarMonumento(id);
  }

  private cargarMonumento(id: string): void {
    this.cargando.set(true);
    this.error.set(null);

    this.monumentosService.getById(id).subscribe({
      next: (monumento) => {
        this.monumento.set(monumento);
        this.cargando.set(false);

        this.cargarFotografias(monumento.id);
      },
      error: () => {
        this.error.set('No se encontró el monumento solicitado.');
        this.cargando.set(false);
      },
    });
  }

  private cargarFotografias(id: string): void {
    this.cargandoFotografias.set(true);
    this.errorFotografias.set(null);

    this.fotografiasService.getAll('MONUMENTO', id).subscribe({
      next: (fotografias) => {
        this.fotografias.set(fotografias);
        this.cargandoFotografias.set(false);
      },
      error: () => {
        this.fotografias.set([]);
        this.errorFotografias.set('No se pudieron cargar las fotografías.');
        this.cargandoFotografias.set(false);
      },
    });
  }
}
