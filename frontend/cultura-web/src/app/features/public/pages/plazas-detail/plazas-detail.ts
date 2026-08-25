import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Fotografia } from '../../../../core/services/fotografias.service';
import { FotografiasPublicService } from '../../../../core/services/fotografias-public.service';
import { Plaza } from '../../../../core/services/plazas.service';
import { PlazasPublicService } from '../../../../core/services/plazas-public.service';

@Component({
  selector: 'app-public-plazas-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './plazas-detail.html',
  styleUrl: './plazas-detail.scss',
})
export class PlazasDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly plazasService = inject(PlazasPublicService);
  private readonly fotografiasService = inject(FotografiasPublicService);

  readonly plaza = signal<Plaza | null>(null);
  readonly fotografias = signal<Fotografia[]>([]);

  readonly cargando = signal(false);
  readonly cargandoFotografias = signal(false);

  readonly error = signal<string | null>(null);
  readonly errorFotografias = signal<string | null>(null);

  readonly fotografiaPrincipal = computed(() => {
    const plaza = this.plaza();
    const fotografias = this.fotografias();

    if (!plaza || fotografias.length === 0) {
      return null;
    }

    if (plaza.fotografiaPrincipalId) {
      const principal = fotografias.find(
        (fotografia) => String(fotografia.id) === String(plaza.fotografiaPrincipalId),
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
      this.error.set('No se encontró la plaza solicitada.');
      return;
    }

    this.cargarPlaza(id);
  }

  private cargarPlaza(id: string): void {
    this.cargando.set(true);
    this.error.set(null);

    this.plazasService.getById(id).subscribe({
      next: (plaza) => {
        this.plaza.set(plaza);
        this.cargando.set(false);

        this.cargarFotografias(plaza.id);
      },
      error: () => {
        this.error.set('No se encontró la plaza solicitada.');
        this.cargando.set(false);
      },
    });
  }

  private cargarFotografias(id: number): void {
    this.cargandoFotografias.set(true);
    this.errorFotografias.set(null);

    this.fotografiasService.getAll('PLAZA', String(id)).subscribe({
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
