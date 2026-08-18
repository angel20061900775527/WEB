import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RolUsuario, UsuariosService } from '../../../../core/services/usuarios.service';

@Component({
  selector: 'app-usuarios-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios-edit.html',
  styleUrl: './usuarios-edit.scss',
})
export class UsuariosEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usuariosService = inject(UsuariosService);

  loading = signal(false);
  error = signal('');

  private usuarioId = 0;

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rol: ['CONSULTA' as RolUsuario, Validators.required],
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
        this.form.patchValue({
          username: usuario.username,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          email: usuario.email,
          rol: usuario.rol,
        });

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

    this.loading.set(true);
    this.error.set('');

    this.usuariosService
      .update(this.usuarioId, {
        username: value.username.trim(),
        nombres: value.nombres.trim(),
        apellidos: value.apellidos.trim(),
        email: value.email.trim(),
        rol: value.rol,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);

          this.error.set(error?.error?.message ?? 'No se pudo actualizar el usuario.');

          this.loading.set(false);
        },
      });
  }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }
}
