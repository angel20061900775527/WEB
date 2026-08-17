import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, forkJoin, of } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ParquesService } from '../../core/services/parques.service';
import { CallesService } from '../../core/services/calles.service';
import { MonumentosService } from '../../core/services/monumentos.service';
import { RiosService } from '../../core/services/rios.service';
import { PlazasService } from '../../core/services/plazas.service';
import { MuseosService } from '../../core/services/museos.service';
import { AuditoriosService } from '../../core/services/auditorios.service';

interface ModuleCard {
  title: string;
  icon: string;
  description: string;
  route: string;
  total: number;
  publicados: number;
  borradores: number;
  inactivos: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly router = inject(Router);

  private readonly parquesService = inject(ParquesService);
  private readonly callesService = inject(CallesService);
  private readonly monumentosService = inject(MonumentosService);
  private readonly riosService = inject(RiosService);
  private readonly plazasService = inject(PlazasService);
  private readonly museosService = inject(MuseosService);
  private readonly auditoriosService = inject(AuditoriosService);

  loading = signal(false);
  error = signal('');

  modules = signal<ModuleCard[]>([
    {
      title: 'Parques',
      icon: 'park',
      description: 'Gestión de parques y espacios verdes patrimoniales.',
      route: '/parques',
      total: 0,
      publicados: 0,
      borradores: 0,
      inactivos: 0,
    },
    {
      title: 'Calles',
      icon: 'signpost',
      description: 'Registro histórico y cultural de calles.',
      route: '/calles',
      total: 0,
      publicados: 0,
      borradores: 0,
      inactivos: 0,
    },
    {
      title: 'Monumentos',
      icon: 'account_balance',
      description: 'Gestión de monumentos y bienes conmemorativos.',
      route: '/monumentos',
      total: 0,
      publicados: 0,
      borradores: 0,
      inactivos: 0,
    },
    {
      title: 'Ríos',
      icon: 'water',
      description: 'Registro de ríos, quebradas, esteros y afluentes.',
      route: '/rios',
      total: 0,
      publicados: 0,
      borradores: 0,
      inactivos: 0,
    },
    {
      title: 'Plazas',
      icon: 'location_city',
      description: 'Gestión de plazas y espacios públicos.',
      route: '/plazas',
      total: 0,
      publicados: 0,
      borradores: 0,
      inactivos: 0,
    },
    {
      title: 'Museos',
      icon: 'museum',
      description: 'Registro y administración de museos.',
      route: '/museos',
      total: 0,
      publicados: 0,
      borradores: 0,
      inactivos: 0,
    },
    {
      title: 'Auditorios',
      icon: 'theater_comedy',
      description: 'Gestión de auditorios y espacios culturales.',
      route: '/auditorios',
      total: 0,
      publicados: 0,
      borradores: 0,
      inactivos: 0,
    },
  ]);

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  private cargarEstadisticas(): void {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      // PARQUES
      parquesTotal: this.protegerPeticion('Parques - total', this.parquesService.getAll(1, 1)),
      parquesPublicados: this.protegerPeticion(
        'Parques - publicados',
        this.parquesService.getAll(1, 1, '', 'ASC', 'PUBLICADO'),
      ),
      parquesBorradores: this.protegerPeticion(
        'Parques - borradores',
        this.parquesService.getAll(1, 1, '', 'ASC', 'BORRADOR'),
      ),
      parquesInactivos: this.protegerPeticion(
        'Parques - inactivos',
        this.parquesService.getAll(1, 1, '', 'ASC', 'INACTIVO'),
      ),

      // CALLES
      callesTotal: this.protegerPeticion('Calles - total', this.callesService.getAll(1, 1)),
      callesPublicadas: this.protegerPeticion(
        'Calles - publicadas',
        this.callesService.getAll(1, 1, '', 'ASC', 'PUBLICADO'),
      ),
      callesBorradores: this.protegerPeticion(
        'Calles - borradores',
        this.callesService.getAll(1, 1, '', 'ASC', 'BORRADOR'),
      ),
      callesInactivas: this.protegerPeticion(
        'Calles - inactivas',
        this.callesService.getAll(1, 1, '', 'ASC', 'INACTIVO'),
      ),

      // MONUMENTOS
      monumentosTotal: this.protegerPeticion(
        'Monumentos - total',
        this.monumentosService.getAll(1, 1),
      ),
      monumentosPublicados: this.protegerPeticion(
        'Monumentos - publicados',
        this.monumentosService.getAll(1, 1, '', 'ASC', 'PUBLICADO'),
      ),
      monumentosBorradores: this.protegerPeticion(
        'Monumentos - borradores',
        this.monumentosService.getAll(1, 1, '', 'ASC', 'BORRADOR'),
      ),
      monumentosInactivos: this.protegerPeticion(
        'Monumentos - inactivos',
        this.monumentosService.getAll(1, 1, '', 'ASC', 'INACTIVO'),
      ),

      // RÍOS
      riosTotal: this.protegerPeticion('Ríos - total', this.riosService.getAll(1, 1)),
      riosPublicados: this.protegerPeticion(
        'Ríos - publicados',
        this.riosService.getAll(1, 1, '', 'ASC', 'PUBLICADO'),
      ),
      riosBorradores: this.protegerPeticion(
        'Ríos - borradores',
        this.riosService.getAll(1, 1, '', 'ASC', 'BORRADOR'),
      ),
      riosInactivos: this.protegerPeticion(
        'Ríos - inactivos',
        this.riosService.getAll(1, 1, '', 'ASC', 'INACTIVO'),
      ),

      // PLAZAS
      plazasTotal: this.protegerPeticion('Plazas - total', this.plazasService.getAll(1, 1)),
      plazasPublicadas: this.protegerPeticion(
        'Plazas - publicadas',
        this.plazasService.getAll(1, 1, '', 'ASC', 'PUBLICADO'),
      ),
      plazasBorradores: this.protegerPeticion(
        'Plazas - borradores',
        this.plazasService.getAll(1, 1, '', 'ASC', 'BORRADOR'),
      ),
      plazasInactivas: this.protegerPeticion(
        'Plazas - inactivas',
        this.plazasService.getAll(1, 1, '', 'ASC', 'INACTIVO'),
      ),

      // MUSEOS
      museosTotal: this.protegerPeticion('Museos - total', this.museosService.getAll(1, 1)),
      museosPublicados: this.protegerPeticion(
        'Museos - publicados',
        this.museosService.getAll(1, 1, '', 'ASC', 'PUBLICADO'),
      ),
      museosBorradores: this.protegerPeticion(
        'Museos - borradores',
        this.museosService.getAll(1, 1, '', 'ASC', 'BORRADOR'),
      ),
      museosInactivos: this.protegerPeticion(
        'Museos - inactivos',
        this.museosService.getAll(1, 1, '', 'ASC', 'INACTIVO'),
      ),

      // AUDITORIOS
      auditoriosTotal: this.protegerPeticion(
        'Auditorios - total',
        this.auditoriosService.getAll(1, 1),
      ),
      auditoriosPublicados: this.protegerPeticion(
        'Auditorios - publicados',
        this.auditoriosService.getAll(1, 1, '', 'ASC', 'PUBLICADO'),
      ),
      auditoriosBorradores: this.protegerPeticion(
        'Auditorios - borradores',
        this.auditoriosService.getAll(1, 1, '', 'ASC', 'BORRADOR'),
      ),
      auditoriosInactivos: this.protegerPeticion(
        'Auditorios - inactivos',
        this.auditoriosService.getAll(1, 1, '', 'ASC', 'INACTIVO'),
      ),
    }).subscribe({
      next: (response) => {
        const estadisticas: Record<
          string,
          {
            total: number;
            publicados: number;
            borradores: number;
            inactivos: number;
          }
        > = {
          Parques: {
            total: response.parquesTotal.total,
            publicados: response.parquesPublicados.total,
            borradores: response.parquesBorradores.total,
            inactivos: response.parquesInactivos.total,
          },
          Calles: {
            total: response.callesTotal.total,
            publicados: response.callesPublicadas.total,
            borradores: response.callesBorradores.total,
            inactivos: response.callesInactivas.total,
          },
          Monumentos: {
            total: response.monumentosTotal.total,
            publicados: response.monumentosPublicados.total,
            borradores: response.monumentosBorradores.total,
            inactivos: response.monumentosInactivos.total,
          },
          Ríos: {
            total: response.riosTotal.total,
            publicados: response.riosPublicados.total,
            borradores: response.riosBorradores.total,
            inactivos: response.riosInactivos.total,
          },
          Plazas: {
            total: response.plazasTotal.total,
            publicados: response.plazasPublicadas.total,
            borradores: response.plazasBorradores.total,
            inactivos: response.plazasInactivas.total,
          },
          Museos: {
            total: response.museosTotal.total,
            publicados: response.museosPublicados.total,
            borradores: response.museosBorradores.total,
            inactivos: response.museosInactivos.total,
          },
          Auditorios: {
            total: response.auditoriosTotal.total,
            publicados: response.auditoriosPublicados.total,
            borradores: response.auditoriosBorradores.total,
            inactivos: response.auditoriosInactivos.total,
          },
        };

        this.modules.update((modules) =>
          modules.map((module) => ({
            ...module,
            ...estadisticas[module.title],
          })),
        );

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error general al cargar estadísticas:', error);

        this.error.set('No se pudieron cargar las estadísticas del sistema.');

        this.loading.set(false);
      },
    });
  }

  private protegerPeticion<T extends { total: number }>(
    nombre: string,
    peticion: Observable<T>,
  ): Observable<T> {
    return peticion.pipe(
      catchError((error) => {
        console.error(`Error en estadísticas: ${nombre}`, error);

        return of({
          total: 0,
        } as T);
      }),
    );
  }

  abrirModulo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
