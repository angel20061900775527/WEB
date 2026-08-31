import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import * as L from 'leaflet';

@Component({
  selector: 'app-patrimonial-map',
  imports: [],
  templateUrl: './patrimonial-map.html',
  styleUrl: './patrimonial-map.scss',
})
export class PatrimonialMap implements AfterViewInit, OnChanges, OnDestroy {
  @Input() latitud: number | null = null;
  @Input() longitud: number | null = null;
  @Input() titulo = 'Ubicación';

  @ViewChild('mapContainer')
  private mapContainer?: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private marker?: L.CircleMarker;
  private vistaInicializada = false;

  ngAfterViewInit(): void {
    this.vistaInicializada = true;
    this.actualizarMapa();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.vistaInicializada &&
      (changes['latitud'] || changes['longitud'] || changes['titulo'])
    ) {
      this.actualizarMapa();
    }
  }

  ngOnDestroy(): void {
    this.destruirMapa();
  }

  tieneCoordenadasValidas(): boolean {
    if (this.latitud === null || this.longitud === null) {
      return false;
    }

    const latitud = Number(this.latitud);
    const longitud = Number(this.longitud);

    return (
      Number.isFinite(latitud) &&
      Number.isFinite(longitud) &&
      latitud >= -90 &&
      latitud <= 90 &&
      longitud >= -180 &&
      longitud <= 180
    );
  }

  private actualizarMapa(): void {
    if (!this.tieneCoordenadasValidas()) {
      this.destruirMapa();
      return;
    }

    if (!this.mapContainer) {
      return;
    }

    const latitud = Number(this.latitud);
    const longitud = Number(this.longitud);

    if (!this.map) {
      this.crearMapa(latitud, longitud);
      return;
    }

    this.map.setView([latitud, longitud], 16);

    if (this.marker) {
      this.marker.setLatLng([latitud, longitud]);

      this.marker.bindTooltip(this.titulo, {
        direction: 'top',
        offset: L.point(0, -8),
      });
    }

    setTimeout(() => {
      this.map?.invalidateSize();
    });
  }

  private crearMapa(latitud: number, longitud: number): void {
    if (!this.mapContainer) {
      return;
    }

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [latitud, longitud],
      zoom: 16,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.marker = L.circleMarker([latitud, longitud], {
      radius: 9,
      weight: 3,
      fillOpacity: 1,
    }).addTo(this.map);

    this.marker.bindTooltip(this.titulo, {
      direction: 'top',
      offset: L.point(0, -8),
    });

    setTimeout(() => {
      this.map?.invalidateSize();
    });
  }

  private destruirMapa(): void {
    if (!this.map) {
      return;
    }

    this.map.remove();
    this.map = undefined;
    this.marker = undefined;
  }
}
