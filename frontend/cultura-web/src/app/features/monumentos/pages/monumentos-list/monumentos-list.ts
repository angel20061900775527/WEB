import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import {
  EstadoMonumento,
  Monumento,
  MonumentosService,
} from '../../../../core/services/monumentos.service';

@Component({
  selector: 'app-monumentos-list',
  imports: [CommonModule],
  templateUrl: './monumentos-list.html',
  styleUrl: './monumentos-list.scss',
})
export class MonumentosList implements OnInit, OnDestroy {
  private readonly monumentosService = inject(MonumentosService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });
  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  monumentos = signal<Monumento[]>([]);

  total = signal(0);
  page = signal(1);
  limit = signal(10);
  totalPages = signal(0);

  search = signal('');
  estado = signal<EstadoMonumento | ''>('');
  order = signal<'ASC' | 'DESC'>('ASC');

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.configurarBusqueda();
    this.cargarMonumentos();
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
        this.cargarMonumentos();
      });
  }

  onSearch(valor: string): void {
    this.searchSubject.next(valor);
  }

  cargarMonumentos(): void {
    this.loading.set(true);
    this.error.set('');

    this.monumentosService
      .getAll(this.page(), this.limit(), this.search(), this.order(), this.estado() || undefined)
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
          console.error('Error al cargar monumentos:', error);

          this.error.set('No se pudieron cargar los monumentos.');
          this.loading.set(false);
        },
      });
  }

  cambiarEstado(estado: EstadoMonumento | ''): void {
    this.estado.set(estado);
    this.page.set(1);
    this.cargarMonumentos();
  }

  cambiarOrden(order: 'ASC' | 'DESC'): void {
    this.order.set(order);
    this.page.set(1);
    this.cargarMonumentos();
  }

  cambiarLimite(limit: number): void {
    this.limit.set(limit);
    this.page.set(1);
    this.cargarMonumentos();
  }

  paginaAnterior(): void {
    if (this.page() <= 1) {
      return;
    }

    this.page.update((page) => page - 1);
    this.cargarMonumentos();
  }

  paginaSiguiente(): void {
    if (this.page() >= this.totalPages()) {
      return;
    }

    this.page.update((page) => page + 1);
    this.cargarMonumentos();
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

  obtenerCoincidenciaSecundaria(monumento: Monumento): { etiqueta: string; texto: string } | null {
    const busqueda = this.search().trim().toLowerCase();

    if (!busqueda) {
      return null;
    }

    if (
      monumento.nombre.toLowerCase().includes(busqueda) ||
      monumento.ubicacion.toLowerCase().includes(busqueda)
    ) {
      return null;
    }

    const campos = [
      {
        etiqueta: 'Descripción',
        texto: monumento.descripcion,
      },
      {
        etiqueta: 'Reseña histórica',
        texto: monumento.resenaHistorica,
      },
      {
        etiqueta: 'Autor',
        texto: monumento.autor,
      },
      {
        etiqueta: 'Personaje homenajeado',
        texto: monumento.personajeHomenajeado,
      },
      {
        etiqueta: 'Tipo',
        texto: monumento.tipo,
      },
      {
        etiqueta: 'Fuentes de información',
        texto: monumento.fuentesInformacion,
      },
      {
        etiqueta: 'Observaciones',
        texto: monumento.observaciones,
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

  nuevoMonumento(): void {
    this.router.navigate(['/monumentos', 'nuevo']);
  }

  verDetalle(id: string): void {
    this.router.navigate(['/monumentos', id]);
  }

  editarMonumento(id: string): void {
    this.router.navigate(['/monumentos', id, 'editar']);
  }

  verEliminados(): void {
    this.router.navigate(['/monumentos', 'eliminados']);
  }

  eliminarMonumento(monumento: Monumento): void {
    const confirmado = window.confirm(
      `¿Está seguro de eliminar el monumento "${monumento.nombre}"?`,
    );

    if (!confirmado) {
      return;
    }

    this.monumentosService.delete(monumento.id).subscribe({
      next: () => {
        this.cargarMonumentos();
      },
      error: (error) => {
        console.error('Error al eliminar monumento:', error);

        this.error.set(error?.error?.message ?? 'No se pudo eliminar el monumento.');
      },
    });
  }
}
