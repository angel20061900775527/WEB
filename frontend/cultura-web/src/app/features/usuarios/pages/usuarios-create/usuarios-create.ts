import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuariosService } from '../../../../core/services/usuarios.service';

@Component({
  selector: 'app-usuarios-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios-create.html',
  styleUrl: './usuarios-create.scss',
})
export class UsuariosCreate {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly usuariosService = inject(UsuariosService);

  loading = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rol: ['CONSULTA' as 'ADMINISTRADOR' | 'CULTURA' | 'CONSULTA', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  guardar(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.loading.set(true);
    this.error.set('');

    this.usuariosService
      .create({
        username: value.username.trim(),
        nombres: value.nombres.trim(),
        apellidos: value.apellidos.trim(),
        email: value.email.trim(),
        rol: value.rol,
        password: value.password,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);

          this.error.set(error?.error?.message ?? 'No se pudo crear el usuario.');

          this.loading.set(false);
        },
      });
  }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }
}
