import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import {
  Auditorio,
  AuditoriosService,
  EstadoAuditorio,
} from '../../../../core/services/auditorios.service';

@Component({
  selector: 'app-auditorios-list',
  imports: [CommonModule],
  templateUrl: './auditorios-list.html',
  styleUrl: './auditorios-list.scss',
})
export class AuditoriosList implements OnInit, OnDestroy {
  private readonly auditoriosService = inject(AuditoriosService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly puedeAdministrar = computed(() => {
    const rol = this.authService.rol();

    return rol === 'ADMINISTRADOR' || rol === 'CULTURA';
  });
  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  auditorios = signal<Auditorio[]>([]);

  total = signal(0);
  page = signal(1);
  limit = signal(10);
  totalPages = signal(0);

  search = signal('');
  estado = signal<EstadoAuditorio | ''>('');
  order = signal<'ASC' | 'DESC'>('ASC');

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.configurarBusqueda();
    this.cargarAuditorios();
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
        this.cargarAuditorios();
      });
  }

  onSearch(valor: string): void {
    this.searchSubject.next(valor);
  }

  cargarAuditorios(): void {
    this.loading.set(true);
    this.error.set('');

    this.auditoriosService
      .getAll(this.page(), this.limit(), this.search(), this.order(), this.estado())
      .subscribe({
        next: (response) => {
          this.auditorios.set(response.auditorios);
          this.total.set(response.total);
          this.page.set(response.page);
          this.limit.set(response.limit);
          this.totalPages.set(response.totalPages);

          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar auditorios:', error);

          this.error.set('No se pudieron cargar los auditorios.');

          this.loading.set(false);
        },
      });
  }

  cambiarEstado(estado: EstadoAuditorio | ''): void {
    this.estado.set(estado);
    this.page.set(1);
    this.cargarAuditorios();
  }

  cambiarOrden(order: 'ASC' | 'DESC'): void {
    this.order.set(order);
    this.page.set(1);
    this.cargarAuditorios();
  }

  cambiarLimite(limit: number): void {
    this.limit.set(limit);
    this.page.set(1);
    this.cargarAuditorios();
  }

  paginaAnterior(): void {
    if (this.page() <= 1) {
      return;
    }

    this.page.update((page) => page - 1);
    this.cargarAuditorios();
  }

  paginaSiguiente(): void {
    if (this.page() >= this.totalPages()) {
      return;
    }

    this.page.update((page) => page + 1);
    this.cargarAuditorios();
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

  obtenerCoincidenciaSecundaria(auditorio: Auditorio): { etiqueta: string; texto: string } | null {
    const busqueda = this.search().trim().toLowerCase();

    if (!busqueda) {
      return null;
    }

    if (
      auditorio.nombre.toLowerCase().includes(busqueda) ||
      auditorio.ubicacion.toLowerCase().includes(busqueda)
    ) {
      return null;
    }

    const campos = [
      {
        etiqueta: 'Descripción',
        texto: auditorio.descripcion,
      },
      {
        etiqueta: 'Reseña histórica',
        texto: auditorio.resenaHistorica,
      },
      {
        etiqueta: 'Horario',
        texto: auditorio.horarioAtencion,
      },
      {
        etiqueta: 'Responsable',
        texto: auditorio.responsable,
      },
      {
        etiqueta: 'Sitio web',
        texto: auditorio.sitioWeb,
      },
      {
        etiqueta: 'Fuentes de información',
        texto: auditorio.fuentesInformacion,
      },
      {
        etiqueta: 'Observaciones',
        texto: auditorio.observaciones,
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

  nuevoAuditorio(): void {
    this.router.navigate(['/auditorios', 'nuevo']);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/auditorios', id]);
  }

  editarAuditorio(id: number): void {
    this.router.navigate(['/auditorios', id, 'editar']);
  }

  verEliminados(): void {
    this.router.navigate(['/auditorios', 'eliminados']);
  }

  eliminarAuditorio(auditorio: Auditorio): void {
    const confirmado = window.confirm(
      `¿Está seguro de eliminar el auditorio "${auditorio.nombre}"?`,
    );

    if (!confirmado) {
      return;
    }

    this.auditoriosService.delete(auditorio.id).subscribe({
      next: () => {
        this.cargarAuditorios();
      },
      error: (error) => {
        console.error('Error al eliminar auditorio:', error);

        this.error.set(error?.error?.message ?? 'No se pudo eliminar el auditorio.');
      },
    });
  }
}
