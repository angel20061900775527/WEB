import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { Auditorio } from '../../../../core/services/auditorios.service';
import { AuditoriosPublicService } from '../../../../core/services/auditorios-public.service';

type AuditorioPublico = Auditorio & {
  fotografiaPrincipalUrl?: string | null;
};

@Component({
  selector: 'app-public-auditorios-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './auditorios-list.html',
  styleUrl: './auditorios-list.scss',
})
export class AuditoriosList implements OnInit, OnDestroy {
  private readonly auditoriosService = inject(AuditoriosPublicService);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  readonly auditorios = signal<AuditorioPublico[]>([]);

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly page = signal(1);
  readonly limit = signal(12);
  readonly total = signal(0);
  readonly totalPages = signal(0);

  readonly search = signal('');

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((valor) => {
        this.search.set(valor.trim());
        this.page.set(1);
        this.cargarAuditorios();
      });

    this.cargarAuditorios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  actualizarBusqueda(valor: string): void {
    this.searchSubject.next(valor);
  }

  limpiarBusqueda(): void {
    this.search.set('');
    this.searchSubject.next('');
  }

  cargarAuditorios(): void {
    this.cargando.set(true);
    this.error.set(null);

    this.auditoriosService.getAll(this.page(), this.limit(), this.search(), 'ASC').subscribe({
      next: (response) => {
        this.auditorios.set(response.auditorios);

        this.total.set(response.total);
        this.page.set(response.page);
        this.limit.set(response.limit);
        this.totalPages.set(response.totalPages);

        this.cargando.set(false);
      },

      error: () => {
        this.error.set('No se pudo cargar el listado de auditorios.');

        this.cargando.set(false);
      },
    });
  }

  segmentarCoincidencias(texto: string): { texto: string; coincide: boolean }[] {
    const busqueda = this.normalizarTexto(this.search().trim());

    if (!busqueda) {
      return [
        {
          texto,
          coincide: false,
        },
      ];
    }

    const textoNormalizado = this.normalizarTexto(texto);

    const segmentos: {
      texto: string;
      coincide: boolean;
    }[] = [];

    let posicion = 0;

    while (posicion < texto.length) {
      const indice = textoNormalizado.indexOf(busqueda, posicion);

      if (indice === -1) {
        segmentos.push({
          texto: texto.slice(posicion),
          coincide: false,
        });

        break;
      }

      if (indice > posicion) {
        segmentos.push({
          texto: texto.slice(posicion, indice),
          coincide: false,
        });
      }

      const fin = indice + busqueda.length;

      segmentos.push({
        texto: texto.slice(indice, fin),
        coincide: true,
      });

      posicion = fin;
    }

    return segmentos.length > 0 ? segmentos : [{ texto, coincide: false }];
  }

  obtenerCoincidenciaSecundaria(
    auditorio: AuditorioPublico,
  ): { etiqueta: string; texto: string } | null {
    const busqueda = this.normalizarTexto(this.search().trim());

    if (!busqueda) {
      return null;
    }

    if (
      this.normalizarTexto(auditorio.nombre).includes(busqueda) ||
      this.normalizarTexto(auditorio.ubicacion).includes(busqueda)
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
        etiqueta: 'Horario de atención',
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
      if (campo.texto && this.normalizarTexto(campo.texto).includes(busqueda)) {
        return {
          etiqueta: campo.etiqueta,
          texto: this.obtenerFragmento(campo.texto),
        };
      }
    }

    return null;
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

  private obtenerFragmento(texto: string): string {
    const busqueda = this.normalizarTexto(this.search().trim());

    const textoNormalizado = this.normalizarTexto(texto);

    const indice = textoNormalizado.indexOf(busqueda);

    if (indice < 0 || texto.length <= 160) {
      return texto;
    }

    const inicio = Math.max(0, indice - 60);

    const fin = Math.min(texto.length, indice + busqueda.length + 80);

    return `${inicio > 0 ? '…' : ''}${texto.slice(inicio, fin)}${fin < texto.length ? '…' : ''}`;
  }

  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
