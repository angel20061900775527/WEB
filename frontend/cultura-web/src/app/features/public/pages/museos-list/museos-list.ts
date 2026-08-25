import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { Museo } from '../../../../core/services/museos.service';
import { MuseosPublicService } from '../../../../core/services/museos-public.service';

@Component({
  selector: 'app-public-museos-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './museos-list.html',
  styleUrl: './museos-list.scss',
})
export class MuseosList implements OnInit, OnDestroy {
  private readonly museosService = inject(MuseosPublicService);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  readonly museos = signal<Museo[]>([]);
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
        this.cargarMuseos();
      });

    this.cargarMuseos();
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

  cargarMuseos(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.museosService.getAll(this.page(), this.limit(), this.search(), 'ASC').subscribe({
      next: (response) => {
        this.museos.set(response.museos);
        this.total.set(response.total);
        this.page.set(response.page);
        this.limit.set(response.limit);
        this.totalPages.set(response.totalPages);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el listado de museos.');
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

  obtenerCoincidenciaSecundaria(museo: Museo): { etiqueta: string; texto: string } | null {
    const busqueda = this.search().trim().toLowerCase();

    if (!busqueda) {
      return null;
    }

    if (
      museo.nombre.toLowerCase().includes(busqueda) ||
      museo.ubicacion.toLowerCase().includes(busqueda)
    ) {
      return null;
    }

    const campos = [
      {
        etiqueta: 'Descripción',
        texto: museo.descripcion,
      },
      {
        etiqueta: 'Reseña histórica',
        texto: museo.resenaHistorica,
      },
      {
        etiqueta: 'Horario de atención',
        texto: museo.horarioAtencion,
      },
      {
        etiqueta: 'Responsable',
        texto: museo.responsable,
      },
      {
        etiqueta: 'Sitio web',
        texto: museo.sitioWeb,
      },
      {
        etiqueta: 'Fuentes de información',
        texto: museo.fuentesInformacion,
      },
      {
        etiqueta: 'Observaciones',
        texto: museo.observaciones,
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
    this.cargarMuseos();
  }

  paginaSiguiente(): void {
    if (this.page() >= this.totalPages()) {
      return;
    }

    this.page.update((page) => page + 1);
    this.cargarMuseos();
  }
}
