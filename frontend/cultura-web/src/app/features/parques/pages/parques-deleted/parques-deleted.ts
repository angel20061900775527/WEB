import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { Parque, ParquesService } from '../../../../core/services/parques.service';

@Component({
  selector: 'app-parques-deleted',
  imports: [CommonModule],
  templateUrl: './parques-deleted.html',
  styleUrl: './parques-deleted.scss',
})
export class ParquesDeleted implements OnInit, OnDestroy {
  private readonly parquesService = inject(ParquesService);
  private readonly router = inject(Router);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  parques = signal<Parque[]>([]);

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

    this.parquesService
      .getDeleted(this.page(), this.limit(), this.search(), this.order())
      .subscribe({
        next: (response) => {
          this.parques.set(response.parques);
          this.total.set(response.total);
          this.page.set(response.page);
          this.limit.set(response.limit);
          this.totalPages.set(response.totalPages);

          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar parques eliminados:', error);

          this.error.set('No se pudieron cargar los parques eliminados.');

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

  restaurarParque(parque: Parque): void {
    const confirmado = window.confirm(`¿Está seguro de restaurar el parque "${parque.nombre}"?`);

    if (!confirmado) {
      return;
    }

    this.parquesService.restore(parque.id).subscribe({
      next: () => {
        this.cargarEliminados();
      },
      error: (error) => {
        console.error('Error al restaurar parque:', error);

        this.error.set(error?.error?.message ?? 'No se pudo restaurar el parque.');
      },
    });
  }

  volver(): void {
    this.router.navigate(['/parques']);
  }
}
