import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { EstadoRio, Rio, RiosService } from '../../../../core/services/rios.service';

@Component({
  selector: 'app-rios-list',
  imports: [CommonModule],
  templateUrl: './rios-list.html',
  styleUrl: './rios-list.scss',
})
export class RiosList implements OnInit, OnDestroy {
  private readonly riosService = inject(RiosService);
  private readonly router = inject(Router);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  rios = signal<Rio[]>([]);

  total = signal(0);
  page = signal(1);
  limit = signal(10);
  totalPages = signal(0);

  search = signal('');
  estado = signal<EstadoRio | ''>('');
  order = signal<'ASC' | 'DESC'>('ASC');

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.configurarBusqueda();
    this.cargarRios();
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
        this.cargarRios();
      });
  }

  onSearch(valor: string): void {
    this.searchSubject.next(valor);
  }

  cargarRios(): void {
    this.loading.set(true);
    this.error.set('');

    this.riosService
      .getAll(this.page(), this.limit(), this.search(), this.order(), this.estado() || undefined)
      .subscribe({
        next: (response) => {
          this.rios.set(response.rios);
          this.total.set(response.total);
          this.page.set(response.page);
          this.limit.set(response.limit);
          this.totalPages.set(response.totalPages);

          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar ríos:', error);

          this.error.set('No se pudieron cargar los ríos.');
          this.loading.set(false);
        },
      });
  }

  cambiarEstado(estado: EstadoRio | ''): void {
    this.estado.set(estado);
    this.page.set(1);
    this.cargarRios();
  }

  cambiarOrden(order: 'ASC' | 'DESC'): void {
    this.order.set(order);
    this.page.set(1);
    this.cargarRios();
  }

  cambiarLimite(limit: number): void {
    this.limit.set(limit);
    this.page.set(1);
    this.cargarRios();
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

  nuevoRio(): void {
    this.router.navigate(['/rios', 'nuevo']);
  }

  verDetalle(id: string): void {
    this.router.navigate(['/rios', id]);
  }

  editarRio(id: string): void {
    this.router.navigate(['/rios', id, 'editar']);
  }

  verEliminados(): void {
    this.router.navigate(['/rios', 'eliminados']);
  }

  eliminarRio(rio: Rio): void {
    const confirmado = window.confirm(`¿Está seguro de eliminar el río "${rio.nombre}"?`);

    if (!confirmado) {
      return;
    }

    this.riosService.delete(rio.id).subscribe({
      next: () => {
        this.cargarRios();
      },
      error: (error) => {
        console.error('Error al eliminar río:', error);

        this.error.set(error?.error?.message ?? 'No se pudo eliminar el río.');
      },
    });
  }
}
