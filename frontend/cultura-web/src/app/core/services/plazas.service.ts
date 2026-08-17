import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type EstadoPlaza = 'BORRADOR' | 'PUBLICADO' | 'INACTIVO';

export interface Plaza {
  id: number;
  nombre: string;
  descripcion: string;
  resenaHistorica: string | null;
  fechaCreacion: string | null;
  estado: EstadoPlaza;
  ubicacion: string;
  latitud: number | null;
  longitud: number | null;
  fuentesInformacion: string | null;
  observaciones: string | null;
  fotografiaPrincipalId: string | null;
  fechaRegistro: string;
  fechaModificacion: string;
}

export interface PlazasResponse {
  plazas: Plaza[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePlazaPayload {
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

export interface UpdatePlazaPayload {
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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlazasService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/plazas';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
    estado: EstadoPlaza | '' = '',
  ): Observable<PlazasResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<PlazasResponse>(this.apiUrl, { params });
  }

  getDeleted(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Observable<PlazasResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PlazasResponse>(`${this.apiUrl}/eliminados`, { params });
  }

  getById(id: number | string): Observable<Plaza> {
    return this.http.get<Plaza>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreatePlazaPayload): Observable<ApiResponse<Plaza>> {
    return this.http.post<ApiResponse<Plaza>>(this.apiUrl, payload);
  }

  update(id: number | string, payload: UpdatePlazaPayload): Observable<ApiResponse<Plaza>> {
    return this.http.put<ApiResponse<Plaza>>(`${this.apiUrl}/${id}`, payload);
  }

  updateEstado(id: number | string, estado: EstadoPlaza): Observable<ApiResponse<Plaza>> {
    return this.http.patch<ApiResponse<Plaza>>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  delete(id: number | string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  restore(id: number | string): Observable<ApiResponse<Plaza>> {
    return this.http.patch<ApiResponse<Plaza>>(`${this.apiUrl}/${id}/restaurar`, {});
  }
}
