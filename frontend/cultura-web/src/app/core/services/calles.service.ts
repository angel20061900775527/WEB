import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type EstadoCalle = 'BORRADOR' | 'PUBLICADO' | 'INACTIVO';

export interface Calle {
  id: string;
  nombre: string;
  descripcion: string;
  resenaHistorica?: string | null;
  fechaDenominacion?: string | null;
  estado: EstadoCalle;
  ubicacion: string;
  sector?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  fuentesInformacion?: string | null;
  observaciones?: string | null;
  fotografiaPrincipalId?: string | null;
  fechaRegistro: string;
  fechaModificacion: string;
}

export interface CallesResponse {
  calles: Calle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateCallePayload {
  nombre: string;
  descripcion: string;
  resenaHistorica?: string | null;
  fechaDenominacion?: string | null;
  ubicacion: string;
  sector?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  fuentesInformacion?: string | null;
  observaciones?: string | null;
}

export interface UpdateCallePayload {
  nombre?: string;
  descripcion?: string;
  resenaHistorica?: string | null;
  fechaDenominacion?: string | null;
  ubicacion?: string;
  sector?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  fuentesInformacion?: string | null;
  observaciones?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CallesService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/calles';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
    estado?: EstadoCalle,
  ): Observable<CallesResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit).set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<CallesResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Calle> {
    return this.http.get<Calle>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreateCallePayload): Observable<unknown> {
    return this.http.post(this.apiUrl, payload);
  }

  update(id: string, payload: UpdateCallePayload): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  updateEstado(id: string, estado: EstadoCalle): Observable<unknown> {
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
  ): Observable<CallesResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit).set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<CallesResponse>(`${this.apiUrl}/eliminados`, { params });
  }

  restore(id: string): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/${id}/restaurar`, {});
  }
}
