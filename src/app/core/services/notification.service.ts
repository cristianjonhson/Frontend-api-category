import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * Servicio para mostrar notificaciones al usuario
 * Utiliza Material Snackbar para feedback visual
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'end',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Muestra un mensaje de éxito
   * @param message Mensaje a mostrar
   * @param duration Duración en ms (opcional)
   */
  success(message: string, duration?: number): void {
    this.show(message, 'success-snackbar', duration);
  }

  /**
   * Muestra un mensaje de error
   * @param message Mensaje a mostrar
   * @param duration Duración en ms (opcional)
   */
  error(message: string, duration?: number): void {
    this.show(message, 'error-snackbar', duration);
  }

  /**
   * Muestra un mensaje de advertencia
   * @param message Mensaje a mostrar
   * @param duration Duración en ms (opcional)
   */
  warning(message: string, duration?: number): void {
    this.show(message, 'warning-snackbar', duration);
  }

  /**
   * Muestra un mensaje informativo
   * @param message Mensaje a mostrar
   * @param duration Duración en ms (opcional)
   */
  info(message: string, duration?: number): void {
    this.show(message, 'info-snackbar', duration);
  }

  /**
   * Método privado para mostrar el snackbar
   * @param message Mensaje
   * @param panelClass Clase CSS para estilos
   * @param duration Duración
   */
  private show(message: string, panelClass: string, duration?: number): void {
    const config: MatSnackBarConfig = {
      ...this.defaultConfig,
      duration: duration || this.defaultConfig.duration,
      panelClass: [panelClass]
    };

    this.snackBar.open(message, 'Cerrar', config);
  }
}
