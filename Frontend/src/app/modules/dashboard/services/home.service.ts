import { Injectable } from '@angular/core';
import { APP_CONFIG } from '../../../shared/constants/app.constants';

export type ApiStatus = 'LOADING' | 'ONLINE' | 'OFFLINE';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  getShowTipsPreference(): boolean {
    try {
      return JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.HOME_SHOW_TIPS) ?? 'true');
    } catch {
      return true;
    }
  }

  setShowTipsPreference(value: boolean): void {
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.HOME_SHOW_TIPS, JSON.stringify(value));
  }

  getStatusLabel(status: ApiStatus): string {
    if (status === 'ONLINE') {
      return 'Conectada';
    }

    if (status === 'OFFLINE') {
      return 'Sin conexion';
    }

    return 'Verificando';
  }

  getCurrentTimestamp(): string {
    return new Date().toLocaleString();
  }
}
