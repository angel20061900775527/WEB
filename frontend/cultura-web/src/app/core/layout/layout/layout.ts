import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../auth/auth.service';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    SidebarComponent,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class LayoutComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly sidebarOpened = signal(true);

  readonly usuario = this.authService.usuario;

  toggleSidebar(): void {
    this.sidebarOpened.update((opened) => !opened);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  obtenerIniciales(): string {
    const usuario = this.usuario();

    if (!usuario) {
      return '--';
    }

    const inicialNombre = usuario.nombres?.trim().charAt(0) ?? '';

    const inicialApellido = usuario.apellidos?.trim().charAt(0) ?? '';

    return `${inicialNombre}${inicialApellido}`.toUpperCase();
  }

  obtenerNombreCompleto(): string {
    const usuario = this.usuario();

    if (!usuario) {
      return '';
    }

    return `${usuario.nombres} ${usuario.apellidos}`.trim();
  }

  obtenerNombreRol(): string {
    const rol = this.usuario()?.rol;

    switch (rol) {
      case 'ADMINISTRADOR':
        return 'Administrador';

      case 'CULTURA':
        return 'Cultura';

      case 'CONSULTA':
        return 'Consulta';

      default:
        return '';
    }
  }
}
