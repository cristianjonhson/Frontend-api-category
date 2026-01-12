import { ErrorHandler, Injectable } from '@angular/core';
import { LoggerService } from '../services/logger.service';

/**
 * Manejador global de errores
 * Captura todos los errores no manejados en la aplicación
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private logger: LoggerService) {}

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
