/**
 * Interface para metadata de respuestas de API
 */
export interface IApiMetadata {
  code: string;
  message?: string;
}

/**
 * Interface genérica para respuestas de la API
 */
export interface IApiResponse<T> {
  metadata: IApiMetadata[];
  [key: string]: any; // Para propiedades dinámicas como categoryResponse, productResponse, etc.
}
