import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { Rio } from '../../../../core/services/rios.service';
import { RiosPublicService } from '../../../../core/services/rios-public.service';

@Component({
  selector: 'app-public-rios-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './rios-list.html',
  styleUrl: './rios-list.scss',
})
export class RiosList implements OnInit, OnDestroy {
  private readonly riosService = inject(RiosPublicService);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  readonly rios = signal<Rio[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly page = signal(1);
  readonly limit = signal(12);
  readonly total = signal(0);
  readonly totalPages = signal(0);

  readonly search = signal('');

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((valor) => {
        this.search.set(valor.trim());
        this.page.set(1);
        this.cargarRios();
      });

    this.cargarRios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  actualizarBusqueda(valor: string): void {
    this.searchSubject.next(valor);
  }

  limpiarBusqueda(): void {
    this.search.set('');
    this.searchSubject.next('');
  }

  cargarRios(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.riosService.getAll(this.page(), this.limit(), this.search(), 'ASC').subscribe({
      next: (response) => {
        this.rios.set(response.rios);
        this.total.set(response.total);
        this.page.set(response.page);
        this.limit.set(response.limit);
        this.totalPages.set(response.totalPages);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el listado de ríos.');
        this.cargando.set(false);
      },
    });
  }

  segmentarCoincidencias(texto: string): { texto: string; coincide: boolean }[] {
    const busqueda = this.search().trim();

    if (!busqueda) {
      return [{ texto, coincide: false }];
    }

    const expresionSegura = busqueda.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regex = new RegExp(`(${expresionSegura})`, 'gi');

    return texto
      .split(regex)
      .filter((parte) => parte.length > 0)
      .map((parte) => ({
        texto: parte,
        coincide: parte.toLowerCase() === busqueda.toLowerCase(),
      }));
  }

  obtenerCoincidenciaSecundaria(rio: Rio): { etiqueta: string; texto: string } | null {
    const busqueda = this.search().trim().toLowerCase();

    if (!busqueda) {
      return null;
    }

    if (
      rio.nombre.toLowerCase().includes(busqueda) ||
      rio.ubicacion.toLowerCase().includes(busqueda)
    ) {
      return null;
    }

    const campos = [
      {
        etiqueta: 'Descripción',
        texto: rio.descripcion,
      },
      {
        etiqueta: 'Reseña histórica',
        texto: rio.resenaHistorica,
      },
      {
        etiqueta: 'Cuenca hidrográfica',
        texto: rio.cuencaHidrografica,
      },
      {
        etiqueta: 'Afluente de',
        texto: rio.afluenteDe,
      },
      {
        etiqueta: 'Tipo',
        texto: rio.tipo,
      },
      {
        etiqueta: 'Estado de conservación',
        texto: rio.estadoConservacion,
      },
      {
        etiqueta: 'Fuentes de información',
        texto: rio.fuentesInformacion,
      },
      {
        etiqueta: 'Observaciones',
        texto: rio.observaciones,
      },
    ];

    for (const campo of campos) {
      if (campo.texto?.toLowerCase().includes(busqueda)) {
        return {
          etiqueta: campo.etiqueta,
          texto: campo.texto,
        };
      }
    }

    return null;
  }

  paginaAnterior(): void {
    if (this.page() <= 1) {
      return;
    }

    this.page.update((page) => page - 1);
    this.cargarRios();
  }

  paginaSiguiente(): void {
    if (this.page() >= this.totalPages()) {
      return;
    }

    this.page.update((page) => page + 1);
    this.cargarRios();
  }
}
