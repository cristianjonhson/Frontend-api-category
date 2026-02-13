import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerService } from '../services/logger.service';
import { NotificationService } from '../services/notification.service';
import { ERROR_MESSAGES } from '../../shared/constants/messages.constants';
import { environment } from '../../../environments/environment';

/**
 * Manejador global de errores
 * Captura todos los errores no manejados en la aplicación
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private logger: LoggerService,
    private notification: NotificationService
  ) {}

  handleError(error: Error | any): void {
    const errorMessage = error?.message || error?.toString() || 'Error desconocido';

    // Log del error
    this.logger.error('Error no manejado capturado:', error, {
      message: errorMessage,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    });

    // En desarrollo, mostrar en consola para debugging
    if (!this.isProduction()) {
      console.error('💥 Error capturado por GlobalErrorHandler:', error);
    }

    this.notification.error(ERROR_MESSAGES.UNKNOWN_ERROR);

    // Aquí puedes agregar lógica adicional:
    // - Enviar a servicio de monitoreo (Sentry, etc.)
    // - Mostrar notificación al usuario
    // - Hacer rollback de cambios
  }

  private isProduction(): boolean {
    // Puedes importar environment si lo necesitas
    return false; // Por ahora en desarrollo
  }
}
