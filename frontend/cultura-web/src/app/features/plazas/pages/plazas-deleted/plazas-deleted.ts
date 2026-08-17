import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { Plaza, PlazasService } from '../../../../core/services/plazas.service';

@Component({
  selector: 'app-plazas-deleted',
  imports: [CommonModule],
  templateUrl: './plazas-deleted.html',
  styleUrl: './plazas-deleted.scss',
})
export class PlazasDeleted implements OnInit, OnDestroy {
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
  order = signal<'ASC' | 'DESC'>('ASC');

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.configurarBusqueda();
    this.cargarEliminadas();
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
        this.cargarEliminadas();
      });
  }

  onSearch(valor: string): void {
    this.searchSubject.next(valor);
  }

  cargarEliminadas(): void {
    this.loading.set(true);
    this.error.set('');

    this.plazasService
      .getDeleted(this.page(), this.limit(), this.search(), this.order())
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
          console.error('Error al cargar plazas eliminadas:', error);

          this.error.set('No se pudieron cargar las plazas eliminadas.');

          this.loading.set(false);
        },
      });
  }

  cambiarOrden(order: 'ASC' | 'DESC'): void {
    this.order.set(order);
    this.page.set(1);
    this.cargarEliminadas();
  }

  cambiarLimite(limit: number): void {
    this.limit.set(limit);
    this.page.set(1);
    this.cargarEliminadas();
  }

  paginaAnterior(): void {
    if (this.page() <= 1) {
      return;
    }

    this.page.update((page) => page - 1);
    this.cargarEliminadas();
  }

  paginaSiguiente(): void {
    if (this.page() >= this.totalPages()) {
      return;
    }

    this.page.update((page) => page + 1);
    this.cargarEliminadas();
  }

  restaurarPlaza(plaza: Plaza): void {
    const confirmado = window.confirm(`¿Está seguro de restaurar la plaza "${plaza.nombre}"?`);

    if (!confirmado) {
      return;
    }

    this.plazasService.restore(plaza.id).subscribe({
      next: () => {
        this.cargarEliminadas();
      },
      error: (error) => {
        console.error('Error al restaurar plaza:', error);

        this.error.set(error?.error?.message ?? 'No se pudo restaurar la plaza.');
      },
    });
  }

  volver(): void {
    this.router.navigate(['/plazas']);
  }
}
