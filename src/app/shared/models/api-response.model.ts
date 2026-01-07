import { IApiResponse, IApiMetadata } from '../interfaces/api-metadata.interface';
import { ApiResponseCode } from '../enums/api-response-code.enum';

/**
 * Modelo genérico para respuestas de la API
 */
export class ApiResponse<T> implements IApiResponse<T> {
  metadata: IApiMetadata[];
  [key: string]: any;

  constructor(data: any = {}) {
    this.metadata = data.metadata || [];
    // Copiar todas las propiedades dinámicas
    Object.keys(data).forEach(key => {
      if (key !== 'metadata') {
        this[key] = data[key];
      }
    });
  }

  /**
   * Verifica si la respuesta fue exitosa
   */
  isSuccess(): boolean {
    return this.metadata.length > 0 &&
           this.metadata[0].code === ApiResponseCode.SUCCESS;
  }

  /**
   * Obtiene el mensaje de la respuesta
   */
  getMessage(): string {
    return this.metadata[0]?.message || '';
  }

  /**
   * Obtiene el código de respuesta
   */
  getCode(): string {
    return this.metadata[0]?.code || '';
  }
}
