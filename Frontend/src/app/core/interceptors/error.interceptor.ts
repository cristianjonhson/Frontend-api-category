import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';
import { ERROR_MESSAGES } from '../../shared/constants/api.constants';

/**
 * Interceptor para manejo centralizado de errores HTTP
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private logger: LoggerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;

        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
          this.logger.error('Error del cliente:', error.error.message);
        } else {
          // Error del lado del servidor
          switch (error.status) {
            case 0:
              errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
              break;
            case 400:
              errorMessage = ERROR_MESSAGES.BAD_REQUEST;
              break;
            case 401:
            case 403:
              errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
              break;
            case 404:
              errorMessage = ERROR_MESSAGES.NOT_FOUND;
              break;
            case 500:
            case 502:
            case 503:
              errorMessage = ERROR_MESSAGES.SERVER_ERROR;
              break;
            default:
              errorMessage = error.error?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
          }

          this.logger.error(
            `Error del servidor: ${error.status}`,
            {
              url: error.url,
              message: error.message,
              status: error.status
            }
          );
        }

        // Retornar un observable con el error
        return throwError(() => ({
          message: errorMessage,
          status: error.status,
          error: error.error
        }));
      })
    );
  }
}
