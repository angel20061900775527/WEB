import { Injectable } from '@angular/core';

import { MENU_CONFIG } from './menu.config';
import { MenuItem } from './menu.model';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  getMenuItems(): MenuItem[] {
    return MENU_CONFIG;
  }
}
