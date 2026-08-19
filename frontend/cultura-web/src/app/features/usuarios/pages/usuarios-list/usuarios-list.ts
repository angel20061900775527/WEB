import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { Usuario, UsuariosService } from '../../../../core/services/usuarios.service';

@Component({
  selector: 'app-usuarios-list',
  imports: [CommonModule],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.scss',
})
export class UsuariosList implements OnInit, OnDestroy {
  private readonly usuariosService = inject(UsuariosService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  readonly usuarioAutenticado = computed(() => this.authService.usuario());

  usuarios = signal<Usuario[]>([]);
  search = signal('');

  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.configurarBusqueda();
    this.cargarUsuarios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private configurarBusqueda(): void {
    this.searchSubject
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((valor) => {
        this.search.set(valor.trim());
        this.cargarUsuarios();
      });
  }

  onSearch(valor: string): void {
    this.searchSubject.next(valor);
  }

  cargarUsuarios(): void {
    this.loading.set(true);
    this.error.set('');

    this.usuariosService.getAll(this.search()).subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);

        this.error.set(error?.error?.message ?? 'No se pudieron cargar los usuarios.');

        this.loading.set(false);
      },
    });
  }

  esUsuarioActual(usuario: Usuario): boolean {
    const autenticado = this.usuarioAutenticado();

    if (!autenticado) {
      return false;
    }

    return Number(usuario.id) === Number(autenticado.id);
  }

  nuevoUsuario(): void {
    this.router.navigate(['/usuarios', 'nuevo']);
  }

  editarUsuario(id: number): void {
    this.router.navigate(['/usuarios', id, 'editar']);
  }

  cambiarEstado(usuario: Usuario): void {
    if (this.esUsuarioActual(usuario)) {
      this.error.set('No puede modificar el estado de su propio usuario.');
      return;
    }

    const nuevoEstado = !usuario.activo;

    const accion = nuevoEstado ? 'activar' : 'desactivar';

    const confirmado = window.confirm(
      `¿Está seguro de ${accion} al usuario "${usuario.username}"?`,
    );

    if (!confirmado) {
      return;
    }

    this.usuariosService.updateEstado(usuario.id, nuevoEstado).subscribe({
      next: () => {
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('Error al cambiar estado del usuario:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar el estado del usuario.');
      },
    });
  }

  cambiarPassword(id: number): void {
    this.router.navigate(['/usuarios', id, 'password']);
  }
}
