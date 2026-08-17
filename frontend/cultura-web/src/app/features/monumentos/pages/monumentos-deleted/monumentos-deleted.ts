import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { Monumento, MonumentosService } from '../../../../core/services/monumentos.service';

@Component({
  selector: 'app-monumentos-deleted',
  imports: [CommonModule],
  templateUrl: './monumentos-deleted.html',
  styleUrl: './monumentos-deleted.scss',
})
export class MonumentosDeleted implements OnInit, OnDestroy {
  private readonly monumentosService = inject(MonumentosService);
  private readonly router = inject(Router);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  monumentos = signal<Monumento[]>([]);

  total = signal(0);
  page = signal(1);
  limit = signal(10);
  totalPages = signal(0);

  search = signal('');
  order = signal<'ASC' | 'DESC'>('ASC');

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.configurarBusqueda();
    this.cargarEliminados();
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
        this.cargarEliminados();
      });
  }

  onSearch(valor: string): void {
    this.searchSubject.next(valor);
  }

  cargarEliminados(): void {
    this.loading.set(true);
    this.error.set('');

    this.monumentosService
      .getDeleted(this.page(), this.limit(), this.search(), this.order())
      .subscribe({
        next: (response) => {
          this.monumentos.set(response.monumentos);
          this.total.set(response.total);
          this.page.set(response.page);
          this.limit.set(response.limit);
          this.totalPages.set(response.totalPages);

          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar monumentos eliminados:', error);

          this.error.set('No se pudieron cargar los monumentos eliminados.');

          this.loading.set(false);
        },
      });
  }

  cambiarOrden(order: 'ASC' | 'DESC'): void {
    this.order.set(order);
    this.page.set(1);
    this.cargarEliminados();
  }

  cambiarLimite(limit: number): void {
    this.limit.set(limit);
    this.page.set(1);
    this.cargarEliminados();
  }

  paginaAnterior(): void {
    if (this.page() <= 1) {
      return;
    }

    this.page.update((page) => page - 1);
    this.cargarEliminados();
  }

  paginaSiguiente(): void {
    if (this.page() >= this.totalPages()) {
      return;
    }

    this.page.update((page) => page + 1);
    this.cargarEliminados();
  }

  restaurarMonumento(monumento: Monumento): void {
    const confirmado = window.confirm(
      `¿Está seguro de restaurar el monumento "${monumento.nombre}"?`,
    );

    if (!confirmado) {
      return;
    }

    this.monumentosService.restore(monumento.id).subscribe({
      next: () => {
        this.cargarEliminados();
      },
      error: (error) => {
        console.error('Error al restaurar monumento:', error);

        this.error.set(error?.error?.message ?? 'No se pudo restaurar el monumento.');
      },
    });
  }

  volver(): void {
    this.router.navigate(['/monumentos']);
  }
}
