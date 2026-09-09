import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Calle } from '../../../../core/services/calles.service';
import { CallesPublicService } from '../../../../core/services/calles-public.service';
import { Fotografia } from '../../../../core/services/fotografias.service';
import { FotografiasPublicService } from '../../../../core/services/fotografias-public.service';
import { PatrimonialMap } from '../../../../shared/components/patrimonial-map/patrimonial-map';

@Component({
  selector: 'app-public-calles-detail',
  imports: [CommonModule, RouterLink, PatrimonialMap],
  templateUrl: './calles-detail.html',
  styleUrl: './calles-detail.scss',
})
export class CallesDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);

  private readonly callesService = inject(CallesPublicService);

  private readonly fotografiasService = inject(FotografiasPublicService);

  readonly calle = signal<Calle | null>(null);
  readonly fotografias = signal<Fotografia[]>([]);

  readonly cargando = signal(false);
  readonly cargandoFotografias = signal(false);

  readonly error = signal<string | null>(null);
  readonly errorFotografias = signal<string | null>(null);

  readonly fotografiaSeleccionada = signal<Fotografia | null>(null);

  readonly fotografiaPrincipal = computed(() => {
    const calle = this.calle();
    const fotografias = this.fotografias();

    if (!calle || fotografias.length === 0) {
      return null;
    }

    if (calle.fotografiaPrincipalId) {
      const principal = fotografias.find(
        (fotografia) => String(fotografia.id) === String(calle.fotografiaPrincipalId),
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

  readonly fotografiasGaleria = computed(() => {
    const principal = this.fotografiaPrincipal();

    if (!principal) {
      return this.fotografias();
    }

    return [principal, ...this.fotografiasSecundarias()];
  });

  readonly indiceFotografiaSeleccionada = computed(() => {
    const seleccionada = this.fotografiaSeleccionada();

    if (!seleccionada) {
      return -1;
    }

    return this.fotografiasGaleria().findIndex(
      (fotografia) => String(fotografia.id) === String(seleccionada.id),
    );
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('No se encontró la calle solicitada.');
      return;
    }

    this.cargarCalle(id);
  }

  abrirFotografia(fotografia: Fotografia): void {
    this.fotografiaSeleccionada.set(fotografia);
    this.document.body.style.overflow = 'hidden';
  }

  cerrarFotografia(): void {
    this.fotografiaSeleccionada.set(null);
    this.document.body.style.overflow = '';
  }

  fotografiaAnterior(): void {
    const fotografias = this.fotografiasGaleria();

    if (fotografias.length <= 1) {
      return;
    }

    const indice = this.indiceFotografiaSeleccionada();

    const nuevoIndice = indice <= 0 ? fotografias.length - 1 : indice - 1;

    this.fotografiaSeleccionada.set(fotografias[nuevoIndice]);
  }

  fotografiaSiguiente(): void {
    const fotografias = this.fotografiasGaleria();

    if (fotografias.length <= 1) {
      return;
    }

    const indice = this.indiceFotografiaSeleccionada();

    const nuevoIndice = indice >= fotografias.length - 1 ? 0 : indice + 1;

    this.fotografiaSeleccionada.set(fotografias[nuevoIndice]);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.fotografiaSeleccionada()) {
      this.cerrarFotografia();
    }
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.fotografiaSeleccionada()) {
      this.fotografiaAnterior();
    }
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.fotografiaSeleccionada()) {
      this.fotografiaSiguiente();
    }
  }

  private cargarCalle(id: string): void {
    this.cargando.set(true);
    this.error.set(null);

    this.callesService.getById(id).subscribe({
      next: (calle) => {
        this.calle.set(calle);
        this.cargando.set(false);

        this.cargarFotografias(String(calle.id));
      },

      error: () => {
        this.error.set('No se encontró la calle solicitada.');

        this.cargando.set(false);
      },
    });
  }

  private cargarFotografias(id: string): void {
    this.cargandoFotografias.set(true);
    this.errorFotografias.set(null);

    this.fotografiasService.getAll('CALLE', id).subscribe({
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
