import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export type RolUsuario = 'ADMINISTRADOR' | 'CULTURA' | 'CONSULTA';

export interface UsuarioAutenticado {
  id: number;
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  rol: RolUsuario;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  usuario: UsuarioAutenticado;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  validarSesion(): Observable<UsuarioAutenticado> {
    return this.http.get<UsuarioAutenticado>(`${this.apiUrl}/perfil`);
  }
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/auth';

  private readonly tokenKey = 'sigpac_token';
  private readonly usuarioKey = 'sigpac_usuario';

  private readonly usuarioSignal = signal<UsuarioAutenticado | null>(this.obtenerUsuarioGuardado());

  readonly usuario = this.usuarioSignal.asReadonly();

  readonly autenticado = computed(() => this.usuarioSignal() !== null && !!this.getToken());

  readonly rol = computed(() => this.usuarioSignal()?.rol ?? null);

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.accessToken);

        localStorage.setItem(this.usuarioKey, JSON.stringify(response.usuario));

        this.usuarioSignal.set(response.usuario);
      }),
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);

    localStorage.removeItem(this.usuarioKey);

    this.usuarioSignal.set(null);
  }

  private obtenerUsuarioGuardado(): UsuarioAutenticado | null {
    const usuario = localStorage.getItem(this.usuarioKey);

    if (!usuario) {
      return null;
    }

    try {
      return JSON.parse(usuario) as UsuarioAutenticado;
    } catch {
      localStorage.removeItem(this.usuarioKey);

      return null;
    }
  }
}

