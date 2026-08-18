import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type RolUsuario = 'ADMINISTRADOR' | 'CULTURA' | 'CONSULTA';

export interface Usuario {
  id: number;
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
  ultimoAcceso: string | null;
}

export interface CreateUsuarioPayload {
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  rol: RolUsuario;
  password: string;
}

export interface UpdateUsuarioPayload {
  username?: string;
  nombres?: string;
  apellidos?: string;
  email?: string;
  rol?: RolUsuario;
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/usuarios';

  getAll(search = ''): Observable<Usuario[]> {
    let params = new HttpParams();

    const busqueda = search.trim();

    if (busqueda) {
      params = params.set('search', busqueda);
    }

    return this.http.get<Usuario[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  create(payload: CreateUsuarioPayload): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, payload);
  }

  update(id: number, payload: UpdateUsuarioPayload): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, payload);
  }

  updateEstado(id: number, activo: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/estado`, { activo });
  }

  changePassword(id: number, password: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/password`, { password });
  }
}
