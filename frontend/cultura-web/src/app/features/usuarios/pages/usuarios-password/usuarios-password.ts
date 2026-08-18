import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Usuario, UsuariosService } from '../../../../core/services/usuarios.service';

@Component({
  selector: 'app-usuarios-password',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="patrimonial-page">
      <div class="patrimonial-header">
        <div>
          <h1>Restablecer contraseña</h1>

          @if (usuario(); as usuarioActual) {
            <p>
              Usuario:
              <strong>{{ usuarioActual.username }}</strong>
            </p>
          }
        </div>
      </div>

      @if (error()) {
        <p>{{ error() }}</p>
      }

      @if (success()) {
        <p>{{ success() }}</p>
      }

      <form [formGroup]="form" (ngSubmit)="guardar()" class="patrimonial-form">
        <div class="patrimonial-form-grid">
          <label>
            <span>Nueva contraseña</span>

            <input type="password" formControlName="password" autocomplete="new-password" />

            @if (form.controls.password.touched && form.controls.password.invalid) {
              <small> La contraseña debe tener al menos 8 caracteres. </small>
            }
          </label>

          <label>
            <span>Confirmar contraseña</span>

            <input
              type="password"
              formControlName="confirmarPassword"
              autocomplete="new-password"
            />

            @if (
              form.controls.confirmarPassword.touched && form.controls.confirmarPassword.invalid
            ) {
              <small> Confirma la contraseña. </small>
            }
          </label>
        </div>

        <div class="patrimonial-form-actions">
          <button type="button" (click)="volver()" [disabled]="loading()">Volver</button>

          <button type="submit" [disabled]="form.invalid || loading()">
            @if (loading()) {
              Guardando...
            } @else {
              Restablecer contraseña
            }
          </button>
        </div>
      </form>
    </section>
  `,
})
export class UsuariosPassword implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usuariosService = inject(UsuariosService);

  usuario = signal<Usuario | null>(null);

  loading = signal(false);
  error = signal('');
  success = signal('');

  private usuarioId = 0;

  form = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmarPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.usuarioId) {
      this.router.navigate(['/usuarios']);
      return;
    }

    this.cargarUsuario();
  }

  private cargarUsuario(): void {
    this.loading.set(true);
    this.error.set('');

    this.usuariosService.getById(this.usuarioId).subscribe({
      next: (usuario) => {
        this.usuario.set(usuario);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);

        this.error.set(error?.error?.message ?? 'No se pudo cargar el usuario.');

        this.loading.set(false);
      },
    });
  }

  guardar(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (value.password !== value.confirmarPassword) {
      this.error.set('Las contraseñas no coinciden.');

      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    this.usuariosService.changePassword(this.usuarioId, value.password).subscribe({
      next: () => {
        this.loading.set(false);

        this.success.set('Contraseña actualizada correctamente.');

        this.form.reset();
      },
      error: (error) => {
        console.error('Error al cambiar contraseña:', error);

        this.error.set(error?.error?.message ?? 'No se pudo actualizar la contraseña.');

        this.loading.set(false);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/usuarios']);
  }
}
