import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Fotografia } from '../../../../core/services/fotografias.service';
import { FotografiasPublicService } from '../../../../core/services/fotografias-public.service';
import { Museo } from '../../../../core/services/museos.service';
import { MuseosPublicService } from '../../../../core/services/museos-public.service';

@Component({
  selector: 'app-public-museos-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './museos-detail.html',
  styleUrl: './museos-detail.scss',
})
export class MuseosDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly museosService = inject(MuseosPublicService);
  private readonly fotografiasService = inject(FotografiasPublicService);

  readonly museo = signal<Museo | null>(null);
  readonly fotografias = signal<Fotografia[]>([]);

  readonly cargando = signal(false);
  readonly cargandoFotografias = signal(false);

  readonly error = signal<string | null>(null);
  readonly errorFotografias = signal<string | null>(null);

  readonly fotografiaPrincipal = computed(() => {
    const museo = this.museo();
    const fotografias = this.fotografias();

    if (!museo || fotografias.length === 0) {
      return null;
    }

    if (museo.fotografiaPrincipalId) {
      const principal = fotografias.find(
        (fotografia) => String(fotografia.id) === String(museo.fotografiaPrincipalId),
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
      this.error.set('No se encontró el museo solicitado.');
      return;
    }

    this.cargarMuseo(id);
  }

  private cargarMuseo(id: string): void {
    this.cargando.set(true);
    this.error.set(null);

    this.museosService.getById(id).subscribe({
      next: (museo) => {
        this.museo.set(museo);
        this.cargando.set(false);

        this.cargarFotografias(museo.id);
      },
      error: () => {
        this.error.set('No se encontró el museo solicitado.');
        this.cargando.set(false);
      },
    });
  }

  private cargarFotografias(id: number): void {
    this.cargandoFotografias.set(true);
    this.errorFotografias.set(null);

    this.fotografiasService.getAll('MUSEO', String(id)).subscribe({
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
