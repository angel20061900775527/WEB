import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type EstadoAuditorio = 'BORRADOR' | 'PUBLICADO' | 'INACTIVO';

export interface Auditorio {
  id: number;
  nombre: string;
  descripcion: string;
  resenaHistorica: string | null;
  estado: EstadoAuditorio;
  ubicacion: string;

  horarioAtencion: string | null;
  responsable: string | null;
  sitioWeb: string | null;

  latitud: number | null;
  longitud: number | null;

  fuentesInformacion: string | null;
  observaciones: string | null;

  fotografiaPrincipalId: string | null;

  fechaRegistro: string;
  fechaModificacion: string;
}

export interface AuditoriosResponse {
  auditorios: Auditorio[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateAuditorioPayload {
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

export interface UpdateAuditorioPayload {
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
export class AuditoriosService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/auditorios';

  getAll(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
    estado: EstadoAuditorio | '' = '',
  ): Observable<AuditoriosResponse> {
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

    return this.http.get<AuditoriosResponse>(this.apiUrl, { params });
  }

  getDeleted(
    page = 1,
    limit = 10,
    search = '',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Observable<AuditoriosResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('order', order);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<AuditoriosResponse>(`${this.apiUrl}/eliminados`, { params });
  }

  getById(id: number | string): Observable<Auditorio> {
    return this.http.get<Auditorio>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreateAuditorioPayload): Observable<ApiResponse<Auditorio>> {
    return this.http.post<ApiResponse<Auditorio>>(this.apiUrl, payload);
  }

  update(id: number | string, payload: UpdateAuditorioPayload): Observable<ApiResponse<Auditorio>> {
    return this.http.put<ApiResponse<Auditorio>>(`${this.apiUrl}/${id}`, payload);
  }

  updateEstado(id: number | string, estado: EstadoAuditorio): Observable<ApiResponse<Auditorio>> {
    return this.http.patch<ApiResponse<Auditorio>>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  delete(id: number | string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  restore(id: number | string): Observable<ApiResponse<Auditorio>> {
    return this.http.patch<ApiResponse<Auditorio>>(`${this.apiUrl}/${id}/restaurar`, {});
  }
}
