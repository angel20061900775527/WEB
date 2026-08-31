import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type EstadoMonumento = 'BORRADOR' | 'PUBLICADO' | 'INACTIVO';

export interface Monumento {
  id: string;
  nombre: string;
  descripcion: string;
  resenaHistorica?: string | null;
  fechaConstruccion?: string | null;
  estado: EstadoMonumento;
  ubicacion: string;

  latitud?: number | null;
  longitud?: number | null;

  fuentesInformacion?: string | null;
  observaciones?: string | null;

  fotografiaPrincipalId?: string | null;
  fotografiaPrincipalUrl?: string | null;

  tipo?: string | null;
  autor?: string | null;
  personajeHomenajeado?: string | null;

  fechaRegistro: string;
  fechaModificacion: string;
}

export interface MonumentosResponse {
  monumentos: Monumento[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateMonumentoPayload {
  nombre: string;
  descripcion: string;
  resenaHistorica?: string | null;
  fechaConstruccion?: string | null;
  ubicacion: string;

  latitud?: number | null;
  longitud?: number | null;

  fuentesInformacion?: string | null;
  observaciones?: string | null;

  tipo?: string | null;
  autor?: string | null;
  personajeHomenajeado?: string | null;
}

export interface UpdateMonumentoPayload {
  nombre?: string;
  descripcion?: string;
  resenaHistorica?: string | null;
  fechaConstruccion?: string | null;
  ubicacion?: string;

  latitud?: number | null;
  longitud?: number | null;

  fuentesInformacion?: string | null;
  observaciones?: string | null;

  tipo?: string | null;
  autor?: string | null;
  personajeHomenajeado?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MonumentosService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/monumentos';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
    estado?: EstadoMonumento,
  ): Observable<MonumentosResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit).set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<MonumentosResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Monumento> {
    return this.http.get<Monumento>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreateMonumentoPayload): Observable<unknown> {
    return this.http.post(this.apiUrl, payload);
  }

  update(id: string, payload: UpdateMonumentoPayload): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  updateEstado(id: string, estado: EstadoMonumento): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado });
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getDeleted(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Observable<MonumentosResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit).set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<MonumentosResponse>(`${this.apiUrl}/eliminados`, { params });
  }

  restore(id: string): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/${id}/restaurar`, {});
  }
}

