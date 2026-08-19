import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type TipoPatrimonio =
  'PARQUE' | 'CALLE' | 'MONUMENTO' | 'RIO' | 'PLAZA' | 'MUSEO' | 'AUDITORIO';

export interface Fotografia {
  id: string;
  tipoPatrimonio: TipoPatrimonio;
  registroId: string;
  nombreOriginal: string;
  nombreArchivo: string;
  mimeType: string;
  tamanioBytes: string;
  ruta: string;
  url: string;
  descripcion: string | null;
  fechaRegistro: string;
}

@Injectable({
  providedIn: 'root',
})
export class FotografiasService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/fotografias';

  getAll(tipoPatrimonio: TipoPatrimonio, registroId: string | number): Observable<Fotografia[]> {
    return this.http.get<Fotografia[]>(`${this.apiUrl}/${tipoPatrimonio}/${registroId}`);
  }

  getById(id: string | number): Observable<Fotografia> {
    return this.http.get<Fotografia>(`${this.apiUrl}/detalle/${id}`);
  }

  upload(
    tipoPatrimonio: TipoPatrimonio,
    registroId: string | number,
    file: File,
    descripcion = '',
  ): Observable<Fotografia> {
    const formData = new FormData();

    formData.append('file', file);

    if (descripcion.trim()) {
      formData.append('descripcion', descripcion.trim());
    }

    return this.http.post<Fotografia>(`${this.apiUrl}/${tipoPatrimonio}/${registroId}`, formData);
  }

  setPrincipal(id: string | number): Observable<Fotografia> {
    return this.http.patch<Fotografia>(`${this.apiUrl}/${id}/principal`, {});
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
