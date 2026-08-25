import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type EstadoParque = 'BORRADOR' | 'PUBLICADO' | 'INACTIVO';

export interface Parque {
  id: string;
  nombre: string;
  descripcion: string;
  resenaHistorica?: string | null;
  fechaCreacion?: string | null;
  estado: EstadoParque;
  ubicacion: string;
  latitud?: number | null;
  longitud?: number | null;
  fuentesInformacion?: string | null;
  observaciones?: string | null;
  fotografiaPrincipalId?: string | null;
  fotografiaPrincipalUrl?: string | null;
  fechaRegistro: string;
  fechaModificacion: string;
}

export interface ParquesResponse {
  parques: Parque[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateParquePayload {
  nombre?: string;
  descripcion?: string;
  resenaHistorica?: string | null;
  fechaCreacion?: string | null;
  ubicacion?: string;
  latitud?: number | null;
  longitud?: number | null;
  fuentesInformacion?: string | null;
  observaciones?: string | null;
}
export interface CreateParquePayload {
  nombre: string;
  descripcion: string;
  resenaHistorica?: string | null;
  fechaCreacion?: string | null;
  ubicacion: string;
  latitud?: number | null;
  longitud?: number | null;
  fuentesInformacion?: string | null;
  observaciones?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ParquesService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/parques';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
    estado?: EstadoParque,
  ): Observable<ParquesResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit).set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<ParquesResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Parque> {
    return this.http.get<Parque>(`${this.apiUrl}/${id}`);
  }

  update(id: string, payload: UpdateParquePayload): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  updateEstado(id: string, estado: EstadoParque): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado });
  }
  create(payload: CreateParquePayload): Observable<unknown> {
    return this.http.post(this.apiUrl, payload);
  }
  delete(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getDeleted(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Observable<ParquesResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit).set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ParquesResponse>(`${this.apiUrl}/eliminados`, { params });
  }

  restore(id: string): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/${id}/restaurar`, {});
  }
}
