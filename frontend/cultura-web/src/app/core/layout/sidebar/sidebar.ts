import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { computed } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { NavigationService } from '../../navigation/navigation.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatListModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  private readonly navigationService = inject(NavigationService);
  private readonly authService = inject(AuthService);

  readonly navigationItems = computed(() => {
    const rol = this.authService.rol();

    return this.navigationService.getMenuItems().filter((item) => {
      if (item.route === '/usuarios') {
        return rol === 'ADMINISTRADOR';
      }

      return true;
    });
  });
}
