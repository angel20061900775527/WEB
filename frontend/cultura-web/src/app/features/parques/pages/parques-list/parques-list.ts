import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

import { EstadoParque, Parque, ParquesService } from '../../../../core/services/parques.service';

@Component({
  selector: 'app-parques-list',
  imports: [CommonModule],
  templateUrl: './parques-list.html',
  styleUrl: './parques-list.scss',
})
export class ParquesList implements OnInit, OnDestroy {
  private readonly parquesService = inject(ParquesService);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  parques = signal<Parque[]>([]);

  total = signal(0);
  page = signal(1);
  limit = signal(10);
  totalPages = signal(0);

  search = signal('');
  order = signal<'ASC' | 'DESC'>('ASC');
  estado = signal<EstadoParque | ''>('');

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.configurarBusqueda();
    this.cargarParques();
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
        this.cargarParques();
      });
  }

  onSearch(valor: string): void {
    this.searchSubject.next(valor);
  }

  cargarParques(): void {
    this.loading.set(true);
    this.error.set('');

    this.parquesService
      .getAll(this.page(), this.limit(), this.search(), this.order(), this.estado() || undefined)
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
          console.error('Error al cargar parques:', error);

          this.error.set('No se pudieron cargar los parques.');
          this.loading.set(false);
        },
      });
  }

  cambiarOrden(order: 'ASC' | 'DESC'): void {
    this.order.set(order);
    this.page.set(1);
    this.cargarParques();
  }
  cambiarEstado(estado: EstadoParque | ''): void {
    this.estado.set(estado);
    this.page.set(1);
    this.cargarParques();
  }

  paginaAnterior(): void {
    if (this.page() <= 1) {
      return;
    }

    this.page.update((page) => page - 1);
    this.cargarParques();
  }

  paginaSiguiente(): void {
    if (this.page() >= this.totalPages()) {
      return;
    }

    this.page.update((page) => page + 1);
    this.cargarParques();
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
  obtenerCoincidenciaSecundaria(parque: Parque): { etiqueta: string; texto: string } | null {
    const busqueda = this.search().trim().toLowerCase();

    if (!busqueda) {
      return null;
    }

    // Nombre y ubicación ya son visibles en la tabla.
    if (
      parque.nombre.toLowerCase().includes(busqueda) ||
      parque.ubicacion.toLowerCase().includes(busqueda)
    ) {
      return null;
    }

    const campos = [
      {
        etiqueta: 'Descripción',
        texto: parque.descripcion,
      },
      {
        etiqueta: 'Reseña histórica',
        texto: parque.resenaHistorica,
      },
      {
        etiqueta: 'Fuentes de información',
        texto: parque.fuentesInformacion,
      },
      {
        etiqueta: 'Observaciones',
        texto: parque.observaciones,
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
  private readonly router = inject(Router);
  cambiarLimite(limit: number): void {
    this.limit.set(limit);
    this.page.set(1);
    this.cargarParques();
  }
  verDetalle(id: string): void {
    this.router.navigate(['/parques', id]);
  }
  editarParque(id: string): void {
    this.router.navigate(['/parques', id, 'editar']);
  }
  nuevoParque(): void {
    this.router.navigate(['/parques', 'nuevo']);
  }
  eliminarParque(parque: Parque): void {
    const confirmado = window.confirm(`¿Está seguro de eliminar el parque "${parque.nombre}"?`);

    if (!confirmado) {
      return;
    }

    this.parquesService.delete(parque.id).subscribe({
      next: () => {
        this.cargarParques();
      },
      error: (error) => {
        console.error('Error al eliminar parque:', error);

        this.error.set(error?.error?.message ?? 'No se pudo eliminar el parque.');
      },
    });
  }
  verEliminados(): void {
    this.router.navigate(['/parques', 'eliminados']);
  }
}
