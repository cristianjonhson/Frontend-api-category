import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LogLevel } from '../../shared/enums/log-level.enum';

/**
 * Servicio de logging centralizado
 * Reemplaza el uso directo de console.log en toda la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private isProduction: boolean = environment.production;

  /**
   * Log de nivel DEBUG
   * @param message Mensaje a loguear
   * @param data Datos adicionales opcionales
   */
  debug(message: string, ...data: any[]): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log de nivel INFO
   * @param message Mensaje a loguear
   * @param data Datos adicionales opcionales
   */
  info(message: string, ...data: any[]): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log de nivel WARN
   * @param message Mensaje a loguear
   * @param data Datos adicionales opcionales
   */
  warn(message: string, ...data: any[]): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log de nivel ERROR
   * @param message Mensaje a loguear
   * @param error Error object opcional
   * @param data Datos adicionales opcionales
   */
  error(message: string, error?: any, ...data: any[]): void {
    this.log(LogLevel.ERROR, message, [error, ...data]);
  }

  /**
   * Método interno para manejar todos los logs
   * @param level Nivel de log
   * @param message Mensaje
   * @param data Datos adicionales
   */
  private log(level: LogLevel, message: string, data: any[]): void {
    // En producción, solo loguear errores y warnings
    if (this.isProduction && (level === LogLevel.DEBUG || level === LogLevel.INFO)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level}]`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, ...data);
        break;
      case LogLevel.INFO:
        console.info(prefix, message, ...data);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, ...data);
        break;
      case LogLevel.ERROR:
        console.error(prefix, message, ...data);
        break;
    }
  }

  /**
   * Limpia la consola (solo en desarrollo)
   */
  clear(): void {
    if (!this.isProduction) {
      console.clear();
    }
  }
}
