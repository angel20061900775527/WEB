import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { Calle, CallesService, EstadoCalle } from '../../../../core/services/calles.service';

@Component({
  selector: 'app-calles-list',
  imports: [CommonModule],
  templateUrl: './calles-list.html',
  styleUrl: './calles-list.scss',
})
export class CallesList implements OnInit, OnDestroy {
  private readonly callesService = inject(CallesService);
  private readonly router = inject(Router);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  calles = signal<Calle[]>([]);

  total = signal(0);
  page = signal(1);
  limit = signal(10);
  totalPages = signal(0);

  search = signal('');
  estado = signal<EstadoCalle | ''>('');
  order = signal<'ASC' | 'DESC'>('ASC');

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.configurarBusqueda();
    this.cargarCalles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private configurarBusqueda(): void {
    this.searchSubject
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((valor) => {
        this.search.set(valor.trim());
        this.page.set(1);
        this.cargarCalles();
      });
  }

  onSearch(valor: string): void {
    this.searchSubject.next(valor);
  }

  cargarCalles(): void {
    this.loading.set(true);
    this.error.set('');

    this.callesService
      .getAll(this.page(), this.limit(), this.search(), this.order(), this.estado() || undefined)
      .subscribe({
        next: (response) => {
          this.calles.set(response.calles);
          this.total.set(response.total);
          this.page.set(response.page);
          this.limit.set(response.limit);
          this.totalPages.set(response.totalPages);

          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar calles:', error);

          this.error.set('No se pudieron cargar las calles.');
          this.loading.set(false);
        },
      });
  }

  cambiarEstado(estado: EstadoCalle | ''): void {
    this.estado.set(estado);
    this.page.set(1);
    this.cargarCalles();
  }

  cambiarOrden(order: 'ASC' | 'DESC'): void {
    this.order.set(order);
    this.page.set(1);
    this.cargarCalles();
  }

  cambiarLimite(limit: number): void {
    this.limit.set(limit);
    this.page.set(1);
    this.cargarCalles();
  }

  paginaAnterior(): void {
    if (this.page() <= 1) {
      return;
    }

    this.page.update((page) => page - 1);
    this.cargarCalles();
  }

  paginaSiguiente(): void {
    if (this.page() >= this.totalPages()) {
      return;
    }

    this.page.update((page) => page + 1);
    this.cargarCalles();
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

  obtenerCoincidenciaSecundaria(calle: Calle): { etiqueta: string; texto: string } | null {
    const busqueda = this.search().trim().toLowerCase();

    if (!busqueda) {
      return null;
    }

    if (
      calle.nombre.toLowerCase().includes(busqueda) ||
      calle.ubicacion.toLowerCase().includes(busqueda) ||
      calle.sector?.toLowerCase().includes(busqueda)
    ) {
      return null;
    }

    const campos = [
      {
        etiqueta: 'Descripción',
        texto: calle.descripcion,
      },
      {
        etiqueta: 'Reseña histórica',
        texto: calle.resenaHistorica,
      },
      {
        etiqueta: 'Fuentes de información',
        texto: calle.fuentesInformacion,
      },
      {
        etiqueta: 'Observaciones',
        texto: calle.observaciones,
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

  nuevaCalle(): void {
    this.router.navigate(['/calles', 'nuevo']);
  }

  verDetalle(id: string): void {
    this.router.navigate(['/calles', id]);
  }

  editarCalle(id: string): void {
    this.router.navigate(['/calles', id, 'editar']);
  }

  verEliminadas(): void {
    this.router.navigate(['/calles', 'eliminados']);
  }

  eliminarCalle(calle: Calle): void {
    const confirmado = window.confirm(`¿Está seguro de eliminar la calle "${calle.nombre}"?`);

    if (!confirmado) {
      return;
    }

    this.callesService.delete(calle.id).subscribe({
      next: () => {
        this.cargarCalles();
      },
      error: (error) => {
        console.error('Error al eliminar calle:', error);

        this.error.set(error?.error?.message ?? 'No se pudo eliminar la calle.');
      },
    });
  }
}
