import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type EstadoRio = 'BORRADOR' | 'PUBLICADO' | 'INACTIVO';

export type EstadoConservacionRio = 'EXCELENTE' | 'BUENO' | 'REGULAR' | 'DETERIORADO';

export type TipoRio = 'PRINCIPAL' | 'AFLUENTE' | 'QUEBRADA' | 'ESTERO';

export interface Rio {
  id: string;
  nombre: string;
  descripcion: string;
  resenaHistorica?: string | null;
  estado: EstadoRio;
  ubicacion: string;

  longitudKm?: number | null;
  cuencaHidrografica?: string | null;
  afluenteDe?: string | null;

  estadoConservacion: EstadoConservacionRio;
  tipo: TipoRio;
  aptoBalneario: boolean;

  latitud?: number | null;
  longitud?: number | null;

  fuentesInformacion?: string | null;
  observaciones?: string | null;

  fotografiaPrincipalId?: string | null;

  fechaRegistro: string;
  fechaModificacion: string;
}

export interface RiosResponse {
  rios: Rio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateRioPayload {
  nombre: string;
  descripcion: string;
  resenaHistorica?: string | null;
  ubicacion: string;

  longitudKm?: number | null;
  cuencaHidrografica?: string | null;
  afluenteDe?: string | null;

  estadoConservacion: EstadoConservacionRio;
  tipo: TipoRio;
  aptoBalneario: boolean;

  latitud?: number | null;
  longitud?: number | null;

  fuentesInformacion?: string | null;
  observaciones?: string | null;
}

export interface UpdateRioPayload {
  nombre?: string;
  descripcion?: string;
  resenaHistorica?: string | null;
  ubicacion?: string;

  longitudKm?: number | null;
  cuencaHidrografica?: string | null;
  afluenteDe?: string | null;

  estadoConservacion?: EstadoConservacionRio;
  tipo?: TipoRio;
  aptoBalneario?: boolean;

  latitud?: number | null;
  longitud?: number | null;

  fuentesInformacion?: string | null;
  observaciones?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class RiosService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/rios';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
    estado?: EstadoRio,
  ): Observable<RiosResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit).set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<RiosResponse>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Rio> {
    return this.http.get<Rio>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreateRioPayload): Observable<unknown> {
    return this.http.post(this.apiUrl, payload);
  }

  update(id: string, payload: UpdateRioPayload): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  updateEstado(id: string, estado: EstadoRio): Observable<unknown> {
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
  ): Observable<RiosResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit).set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<RiosResponse>(`${this.apiUrl}/eliminados`, { params });
  }

  restore(id: string): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/${id}/restaurar`, {});
  }
}
