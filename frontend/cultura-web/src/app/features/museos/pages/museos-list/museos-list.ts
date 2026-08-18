import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { EstadoMuseo, Museo, MuseosService } from '../../../../core/services/museos.service';

@Component({
  selector: 'app-museos-list',
  imports: [CommonModule],
  templateUrl: './museos-list.html',
  styleUrl: './museos-list.scss',
})
export class MuseosList implements OnInit, OnDestroy {
  private readonly museosService = inject(MuseosService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });
  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  museos = signal<Museo[]>([]);

  total = signal(0);
  page = signal(1);
  limit = signal(10);
  totalPages = signal(0);

  search = signal('');
  estado = signal<EstadoMuseo | ''>('');
  order = signal<'ASC' | 'DESC'>('ASC');

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.configurarBusqueda();
    this.cargarMuseos();
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
        this.cargarMuseos();
      });
  }

  onSearch(valor: string): void {
    this.searchSubject.next(valor);
  }

  cargarMuseos(): void {
    this.loading.set(true);
    this.error.set('');

    this.museosService
      .getAll(this.page(), this.limit(), this.search(), this.order(), this.estado())
      .subscribe({
        next: (response) => {
          this.museos.set(response.museos);
          this.total.set(response.total);
          this.page.set(response.page);
          this.limit.set(response.limit);
          this.totalPages.set(response.totalPages);

          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar museos:', error);

          this.error.set('No se pudieron cargar los museos.');

          this.loading.set(false);
        },
      });
  }

  cambiarEstado(estado: EstadoMuseo | ''): void {
    this.estado.set(estado);
    this.page.set(1);
    this.cargarMuseos();
  }

  cambiarOrden(order: 'ASC' | 'DESC'): void {
    this.order.set(order);
    this.page.set(1);
    this.cargarMuseos();
  }

  cambiarLimite(limit: number): void {
    this.limit.set(limit);
    this.page.set(1);
    this.cargarMuseos();
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
        etiqueta: 'Horario',
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

  nuevoMuseo(): void {
    this.router.navigate(['/museos', 'nuevo']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/museos', id]);
  }

  editarMuseo(id: number): void {
    this.router.navigate(['/museos', id, 'editar']);
  }

  verEliminados(): void {
    this.router.navigate(['/museos', 'eliminados']);
  }

  eliminarMuseo(museo: Museo): void {
    const confirmado = window.confirm(`¿Está seguro de eliminar el museo "${museo.nombre}"?`);

    if (!confirmado) {
      return;
    }

    this.museosService.delete(museo.id).subscribe({
      next: () => {
        this.cargarMuseos();
      },
      error: (error) => {
        console.error('Error al eliminar museo:', error);

        this.error.set(error?.error?.message ?? 'No se pudo eliminar el museo.');
      },
    });
  }
}
