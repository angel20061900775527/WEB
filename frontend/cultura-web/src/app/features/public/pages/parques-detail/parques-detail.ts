import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Fotografia } from '../../../../core/services/fotografias.service';
import { FotografiasPublicService } from '../../../../core/services/fotografias-public.service';
import { Parque } from '../../../../core/services/parques.service';
import { ParquesPublicService } from '../../../../core/services/parques-public.service';

@Component({
  selector: 'app-public-parques-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './parques-detail.html',
  styleUrl: './parques-detail.scss',
})
export class ParquesDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly parquesService = inject(ParquesPublicService);
  private readonly fotografiasService = inject(FotografiasPublicService);

  readonly parque = signal<Parque | null>(null);
  readonly fotografias = signal<Fotografia[]>([]);

  readonly cargando = signal(false);
  readonly cargandoFotografias = signal(false);

  readonly error = signal<string | null>(null);
  readonly errorFotografias = signal<string | null>(null);

  readonly fotografiaPrincipal = computed(() => {
    const parque = this.parque();
    const fotografias = this.fotografias();

    if (!parque || fotografias.length === 0) {
      return null;
    }

    if (parque.fotografiaPrincipalId) {
      const principal = fotografias.find(
        (fotografia) => String(fotografia.id) === String(parque.fotografiaPrincipalId),
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
      this.error.set('No se encontró el parque solicitado.');
      return;
    }

    this.cargarParque(id);
  }

  private cargarParque(id: string): void {
    this.cargando.set(true);
    this.error.set(null);

    this.parquesService.getById(id).subscribe({
      next: (parque) => {
        this.parque.set(parque);
        this.cargando.set(false);

        this.cargarFotografias(parque.id);
      },
      error: () => {
        this.error.set('No se encontró el parque solicitado.');
        this.cargando.set(false);
      },
    });
  }

  private cargarFotografias(id: string): void {
    this.cargandoFotografias.set(true);
    this.errorFotografias.set(null);

    this.fotografiasService.getAll('PARQUE', id).subscribe({
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
