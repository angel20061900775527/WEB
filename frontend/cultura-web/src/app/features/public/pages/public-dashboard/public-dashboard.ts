import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, takeUntil } from 'rxjs';

import { AuditoriosPublicService } from '../../../../core/services/auditorios-public.service';
import { CallesPublicService } from '../../../../core/services/calles-public.service';
import { MonumentosPublicService } from '../../../../core/services/monumentos-public.service';
import { MuseosPublicService } from '../../../../core/services/museos-public.service';
import { ParquesPublicService } from '../../../../core/services/parques-public.service';
import { PlazasPublicService } from '../../../../core/services/plazas-public.service';
import { RiosPublicService } from '../../../../core/services/rios-public.service';

interface CategoriaPatrimonial {
  titulo: string;
  descripcion: string;
  ruta: string;
  total: number;
  clave: string;
}

interface CampoBusqueda {
  etiqueta: string;
  texto: string | null | undefined;
}

interface ResultadoBusquedaGlobal {
  id: string;
  nombre: string;
  ubicacion: string;
  categoria: string;
  ruta: string;
  descripcion?: string | null;
  resenaHistorica?: string | null;
  fuentesInformacion?: string | null;
  observaciones?: string | null;
  camposAdicionales?: CampoBusqueda[];
}

@Component({
  selector: 'app-public-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './public-dashboard.html',
  styleUrl: './public-dashboard.scss',
})
export class PublicDashboard implements OnInit, OnDestroy {
  private readonly parquesService = inject(ParquesPublicService);
  private readonly callesService = inject(CallesPublicService);
  private readonly monumentosService = inject(MonumentosPublicService);
  private readonly riosService = inject(RiosPublicService);
  private readonly plazasService = inject(PlazasPublicService);
  private readonly museosService = inject(MuseosPublicService);
  private readonly auditoriosService = inject(AuditoriosPublicService);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly buscando = signal(false);
  readonly errorBusqueda = signal<string | null>(null);
  readonly search = signal('');
  readonly resultados = signal<ResultadoBusquedaGlobal[]>([]);

  readonly totalPatrimonio = signal(0);

  readonly categorias = signal<CategoriaPatrimonial[]>(this.crearCategorias());

  ngOnInit(): void {
    this.configurarBusqueda();
    this.cargarTotales();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private crearCategorias(totales?: Partial<Record<string, number>>): CategoriaPatrimonial[] {
    return [
      {
        titulo: 'Parques',
        descripcion: 'Espacios verdes y lugares de encuentro.',
        ruta: '/public/parques',
        total: totales?.['parques'] ?? 0,
        clave: 'parques',
      },
      {
        titulo: 'Calles',
        descripcion: 'Historia y denominación de nuestras calles.',
        ruta: '/public/calles',
        total: totales?.['calles'] ?? 0,
        clave: 'calles',
      },
      {
        titulo: 'Monumentos',
        descripcion: 'Símbolos que conservan nuestra memoria.',
        ruta: '/public/monumentos',
        total: totales?.['monumentos'] ?? 0,
        clave: 'monumentos',
      },
      {
        titulo: 'Ríos',
        descripcion: 'Patrimonio natural y recursos hídricos.',
        ruta: '/public/rios',
        total: totales?.['rios'] ?? 0,
        clave: 'rios',
      },
      {
        titulo: 'Plazas',
        descripcion: 'Espacios de encuentro social y cultural.',
        ruta: '/public/plazas',
        total: totales?.['plazas'] ?? 0,
        clave: 'plazas',
      },
      {
        titulo: 'Museos',
        descripcion: 'Memoria, conservación y difusión cultural.',
        ruta: '/public/museos',
        total: totales?.['museos'] ?? 0,
        clave: 'museos',
      },
      {
        titulo: 'Auditorios',
        descripcion: 'Escenarios culturales y comunitarios.',
        ruta: '/public/auditorios',
        total: totales?.['auditorios'] ?? 0,
        clave: 'auditorios',
      },
    ];
  }

  private configurarBusqueda(): void {
    this.searchSubject
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((valor) => {
        const termino = valor.trim();

        this.search.set(termino);

        if (!termino) {
          this.resultados.set([]);
          this.errorBusqueda.set(null);
          this.buscando.set(false);
          return;
        }

        this.buscarGlobalmente(termino);
      });
  }

  actualizarBusqueda(valor: string): void {
    this.searchSubject.next(valor);
  }

  limpiarBusqueda(): void {
    this.search.set('');
    this.resultados.set([]);
    this.errorBusqueda.set(null);
    this.buscando.set(false);
    this.searchSubject.next('');
  }

  private cargarTotales(): void {
    this.cargando.set(true);
    this.error.set(null);

    forkJoin({
      parques: this.parquesService.getAll(1, 1, '', 'ASC'),
      calles: this.callesService.getAll(1, 1, '', 'ASC'),
      monumentos: this.monumentosService.getAll(1, 1, '', 'ASC'),
      rios: this.riosService.getAll(1, 1, '', 'ASC'),
      plazas: this.plazasService.getAll(1, 1, '', 'ASC'),
      museos: this.museosService.getAll(1, 1, '', 'ASC'),
      auditorios: this.auditoriosService.getAll(1, 1, '', 'ASC'),
    }).subscribe({
      next: (response) => {
        const categorias = this.crearCategorias({
          parques: response.parques.total,
          calles: response.calles.total,
          monumentos: response.monumentos.total,
          rios: response.rios.total,
          plazas: response.plazas.total,
          museos: response.museos.total,
          auditorios: response.auditorios.total,
        });

        this.categorias.set(categorias);

        this.totalPatrimonio.set(
          categorias.reduce((total, categoria) => total + categoria.total, 0),
        );

        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la información del patrimonio.');
        this.cargando.set(false);
      },
    });
  }

  private buscarGlobalmente(termino: string): void {
    this.buscando.set(true);
    this.errorBusqueda.set(null);

    forkJoin({
      parques: this.parquesService.getAll(1, 20, termino, 'ASC'),
      calles: this.callesService.getAll(1, 20, termino, 'ASC'),
      monumentos: this.monumentosService.getAll(1, 20, termino, 'ASC'),
      rios: this.riosService.getAll(1, 20, termino, 'ASC'),
      plazas: this.plazasService.getAll(1, 20, termino, 'ASC'),
      museos: this.museosService.getAll(1, 20, termino, 'ASC'),
      auditorios: this.auditoriosService.getAll(1, 20, termino, 'ASC'),
    }).subscribe({
      next: (response) => {
        const resultados: ResultadoBusquedaGlobal[] = [
          ...response.parques.parques.map((item) => ({
            id: String(item.id),
            nombre: item.nombre,
            ubicacion: item.ubicacion,
            categoria: 'Parque',
            ruta: `/public/parques/${item.id}`,
            descripcion: item.descripcion,
            resenaHistorica: item.resenaHistorica,
            fuentesInformacion: item.fuentesInformacion,
            observaciones: item.observaciones,
          })),

          ...response.calles.calles.map((item) => ({
            id: String(item.id),
            nombre: item.nombre,
            ubicacion: item.ubicacion,
            categoria: 'Calle',
            ruta: `/public/calles/${item.id}`,
            descripcion: item.descripcion,
            resenaHistorica: item.resenaHistorica,
            fuentesInformacion: item.fuentesInformacion,
            observaciones: item.observaciones,
            camposAdicionales: [
              {
                etiqueta: 'Sector',
                texto: item.sector,
              },
            ],
          })),

          ...response.monumentos.monumentos.map((item) => ({
            id: String(item.id),
            nombre: item.nombre,
            ubicacion: item.ubicacion,
            categoria: 'Monumento',
            ruta: `/public/monumentos/${item.id}`,
            descripcion: item.descripcion,
            resenaHistorica: item.resenaHistorica,
            fuentesInformacion: item.fuentesInformacion,
            observaciones: item.observaciones,
            camposAdicionales: [
              {
                etiqueta: 'Tipo',
                texto: item.tipo,
              },
              {
                etiqueta: 'Autor',
                texto: item.autor,
              },
              {
                etiqueta: 'Personaje homenajeado',
                texto: item.personajeHomenajeado,
              },
            ],
          })),

          ...response.rios.rios.map((item) => ({
            id: String(item.id),
            nombre: item.nombre,
            ubicacion: item.ubicacion,
            categoria: 'Río',
            ruta: `/public/rios/${item.id}`,
            descripcion: item.descripcion,
            resenaHistorica: item.resenaHistorica,
            fuentesInformacion: item.fuentesInformacion,
            observaciones: item.observaciones,
            camposAdicionales: [
              {
                etiqueta: 'Cuenca hidrográfica',
                texto: item.cuencaHidrografica,
              },
              {
                etiqueta: 'Afluente de',
                texto: item.afluenteDe,
              },
              {
                etiqueta: 'Tipo',
                texto: item.tipo,
              },
              {
                etiqueta: 'Estado de conservación',
                texto: item.estadoConservacion,
              },
            ],
          })),

          ...response.plazas.plazas.map((item) => ({
            id: String(item.id),
            nombre: item.nombre,
            ubicacion: item.ubicacion,
            categoria: 'Plaza',
            ruta: `/public/plazas/${item.id}`,
            descripcion: item.descripcion,
            resenaHistorica: item.resenaHistorica,
            fuentesInformacion: item.fuentesInformacion,
            observaciones: item.observaciones,
          })),

          ...response.museos.museos.map((item) => ({
            id: String(item.id),
            nombre: item.nombre,
            ubicacion: item.ubicacion,
            categoria: 'Museo',
            ruta: `/public/museos/${item.id}`,
            descripcion: item.descripcion,
            resenaHistorica: item.resenaHistorica,
            fuentesInformacion: item.fuentesInformacion,
            observaciones: item.observaciones,
            camposAdicionales: [
              {
                etiqueta: 'Horario de atención',
                texto: item.horarioAtencion,
              },
              {
                etiqueta: 'Responsable',
                texto: item.responsable,
              },
              {
                etiqueta: 'Sitio web',
                texto: item.sitioWeb,
              },
            ],
          })),

          ...response.auditorios.auditorios.map((item) => ({
            id: String(item.id),
            nombre: item.nombre,
            ubicacion: item.ubicacion,
            categoria: 'Auditorio',
            ruta: `/public/auditorios/${item.id}`,
            descripcion: item.descripcion,
            resenaHistorica: item.resenaHistorica,
            fuentesInformacion: item.fuentesInformacion,
            observaciones: item.observaciones,
            camposAdicionales: [
              {
                etiqueta: 'Horario de atención',
                texto: item.horarioAtencion,
              },
              {
                etiqueta: 'Responsable',
                texto: item.responsable,
              },
              {
                etiqueta: 'Sitio web',
                texto: item.sitioWeb,
              },
            ],
          })),
        ];

        this.resultados.set(resultados);
        this.buscando.set(false);
      },
      error: () => {
        this.resultados.set([]);
        this.errorBusqueda.set('No se pudo realizar la búsqueda.');
        this.buscando.set(false);
      },
    });
  }

  segmentarCoincidencias(texto: string): { texto: string; coincide: boolean }[] {
    const busquedaOriginal = this.search().trim();

    if (!busquedaOriginal) {
      return [{ texto, coincide: false }];
    }

    const busquedaNormalizada = this.normalizarTexto(busquedaOriginal);

    const segmentos: { texto: string; coincide: boolean }[] = [];

    let inicioSegmento = 0;
    let indice = 0;

    while (indice < texto.length) {
      let coincidenciaEncontrada = false;

      for (let fin = indice + 1; fin <= texto.length; fin++) {
        const fragmento = texto.slice(indice, fin);

        if (this.normalizarTexto(fragmento) === busquedaNormalizada) {
          if (indice > inicioSegmento) {
            segmentos.push({
              texto: texto.slice(inicioSegmento, indice),
              coincide: false,
            });
          }

          segmentos.push({
            texto: fragmento,
            coincide: true,
          });

          indice = fin;
          inicioSegmento = fin;
          coincidenciaEncontrada = true;

          break;
        }

        if (this.normalizarTexto(fragmento).length > busquedaNormalizada.length) {
          break;
        }
      }

      if (!coincidenciaEncontrada) {
        indice++;
      }
    }

    if (inicioSegmento < texto.length) {
      segmentos.push({
        texto: texto.slice(inicioSegmento),
        coincide: false,
      });
    }

    return segmentos.length > 0 ? segmentos : [{ texto, coincide: false }];
  }

  obtenerCoincidenciaSecundaria(
    resultado: ResultadoBusquedaGlobal,
  ): { etiqueta: string; texto: string } | null {
    const busqueda = this.normalizarTexto(this.search().trim());

    if (!busqueda) {
      return null;
    }

    if (
      this.normalizarTexto(resultado.nombre).includes(busqueda) ||
      this.normalizarTexto(resultado.ubicacion).includes(busqueda)
    ) {
      return null;
    }

    const campos: CampoBusqueda[] = [
      {
        etiqueta: 'Descripción',
        texto: resultado.descripcion,
      },
      {
        etiqueta: 'Reseña histórica',
        texto: resultado.resenaHistorica,
      },
      ...(resultado.camposAdicionales ?? []),
      {
        etiqueta: 'Fuentes de información',
        texto: resultado.fuentesInformacion,
      },
      {
        etiqueta: 'Observaciones',
        texto: resultado.observaciones,
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

  private obtenerFragmento(texto: string): string {
    const busqueda = this.normalizarTexto(this.search().trim());

    const textoNormalizado = this.normalizarTexto(texto);

    const indice = textoNormalizado.indexOf(busqueda);

    if (indice < 0 || texto.length <= 180) {
      return texto;
    }

    const inicio = Math.max(0, indice - 70);

    const fin = Math.min(texto.length, indice + busqueda.length + 90);

    return `${inicio > 0 ? '…' : ''}${texto.slice(inicio, fin)}${fin < texto.length ? '…' : ''}`;
  }
  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
