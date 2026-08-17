import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { EstadoPlaza, Plaza, PlazasService } from '../../../../core/services/plazas.service';

@Component({
  selector: 'app-plazas-list',
  imports: [CommonModule],
  templateUrl: './plazas-list.html',
  styleUrl: './plazas-list.scss',
})
export class PlazasList implements OnInit, OnDestroy {
  private readonly plazasService = inject(PlazasService);
  private readonly router = inject(Router);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  plazas = signal<Plaza[]>([]);

  total = signal(0);
  page = signal(1);
  limit = signal(10);
  totalPages = signal(0);

  search = signal('');
  estado = signal<EstadoPlaza | ''>('');
  order = signal<'ASC' | 'DESC'>('ASC');

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.configurarBusqueda();
    this.cargarPlazas();
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
        this.cargarPlazas();
      });
  }

  onSearch(valor: string): void {
    this.searchSubject.next(valor);
  }

  cargarPlazas(): void {
    this.loading.set(true);
    this.error.set('');

    this.plazasService
      .getAll(this.page(), this.limit(), this.search(), this.order(), this.estado())
      .subscribe({
        next: (response) => {
          this.plazas.set(response.plazas);
          this.total.set(response.total);
          this.page.set(response.page);
          this.limit.set(response.limit);
          this.totalPages.set(response.totalPages);

          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar plazas:', error);

          this.error.set('No se pudieron cargar las plazas.');

          this.loading.set(false);
        },
      });
  }

  cambiarEstado(estado: EstadoPlaza | ''): void {
    this.estado.set(estado);
    this.page.set(1);
    this.cargarPlazas();
  }

  cambiarOrden(order: 'ASC' | 'DESC'): void {
    this.order.set(order);
    this.page.set(1);
    this.cargarPlazas();
  }

  cambiarLimite(limit: number): void {
    this.limit.set(limit);
    this.page.set(1);
    this.cargarPlazas();
  }

  paginaAnterior(): void {
    if (this.page() <= 1) {
      return;
    }

    this.page.update((page) => page - 1);
    this.cargarPlazas();
  }

  paginaSiguiente(): void {
    if (this.page() >= this.totalPages()) {
      return;
    }

    this.page.update((page) => page + 1);
    this.cargarPlazas();
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

  obtenerCoincidenciaSecundaria(plaza: Plaza): { etiqueta: string; texto: string } | null {
    const busqueda = this.search().trim().toLowerCase();

    if (!busqueda) {
      return null;
    }

    if (
      plaza.nombre.toLowerCase().includes(busqueda) ||
      plaza.ubicacion.toLowerCase().includes(busqueda)
    ) {
      return null;
    }

    const campos = [
      {
        etiqueta: 'Descripción',
        texto: plaza.descripcion,
      },
      {
        etiqueta: 'Reseña histórica',
        texto: plaza.resenaHistorica,
      },
      {
        etiqueta: 'Fuentes de información',
        texto: plaza.fuentesInformacion,
      },
      {
        etiqueta: 'Observaciones',
        texto: plaza.observaciones,
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

  nuevaPlaza(): void {
    this.router.navigate(['/plazas', 'nuevo']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/plazas', id]);
  }

  editarPlaza(id: number): void {
    this.router.navigate(['/plazas', id, 'editar']);
  }

  verEliminadas(): void {
    this.router.navigate(['/plazas', 'eliminados']);
  }

  eliminarPlaza(plaza: Plaza): void {
    const confirmado = window.confirm(`¿Está seguro de eliminar la plaza "${plaza.nombre}"?`);

    if (!confirmado) {
      return;
    }

    this.plazasService.delete(plaza.id).subscribe({
      next: () => {
        this.cargarPlazas();
      },
      error: (error) => {
        console.error('Error al eliminar plaza:', error);

        this.error.set(error?.error?.message ?? 'No se pudo eliminar la plaza.');
      },
    });
  }
}
