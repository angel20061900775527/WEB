import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type EstadoMuseo = 'BORRADOR' | 'PUBLICADO' | 'INACTIVO';

export interface Museo {
  id: number;
  nombre: string;
  descripcion: string;
  resenaHistorica: string | null;
  estado: EstadoMuseo;
  ubicacion: string;

  horarioAtencion: string | null;
  responsable: string | null;
  sitioWeb: string | null;

  latitud: number | null;
  longitud: number | null;

  fuentesInformacion: string | null;
  observaciones: string | null;

  fotografiaPrincipalId: string | null;
  fotografiaPrincipalUrl?: string | null;

  fechaRegistro: string;
  fechaModificacion: string;
}

export interface MuseosResponse {
  museos: Museo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateMuseoPayload {
  nombre: string;
  descripcion: string;
  resenaHistorica?: string | null;
  ubicacion: string;

  horarioAtencion?: string | null;
  responsable?: string | null;
  sitioWeb?: string | null;

  latitud?: number | null;
  longitud?: number | null;

  fuentesInformacion?: string | null;
  observaciones?: string | null;
}

export interface UpdateMuseoPayload {
  nombre?: string;
  descripcion?: string;
  resenaHistorica?: string | null;
  ubicacion?: string;

  horarioAtencion?: string | null;
  responsable?: string | null;
  sitioWeb?: string | null;

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
export class MuseosService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/museos';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
    estado: EstadoMuseo | '' = '',
  ): Observable<MuseosResponse> {
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

    return this.http.get<MuseosResponse>(this.apiUrl, { params });
  }

  getDeleted(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Observable<MuseosResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<MuseosResponse>(`${this.apiUrl}/eliminados`, { params });
  }

  getById(id: number | string): Observable<Museo> {
    return this.http.get<Museo>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreateMuseoPayload): Observable<ApiResponse<Museo>> {
    return this.http.post<ApiResponse<Museo>>(this.apiUrl, payload);
  }

  update(id: number | string, payload: UpdateMuseoPayload): Observable<ApiResponse<Museo>> {
    return this.http.put<ApiResponse<Museo>>(`${this.apiUrl}/${id}`, payload);
  }

  updateEstado(id: number | string, estado: EstadoMuseo): Observable<ApiResponse<Museo>> {
    return this.http.patch<ApiResponse<Museo>>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  delete(id: number | string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  restore(id: number | string): Observable<ApiResponse<Museo>> {
    return this.http.patch<ApiResponse<Museo>>(`${this.apiUrl}/${id}/restaurar`, {});
  }
}

