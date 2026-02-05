/**
 * Constantes de configuración de la API
 */
export const API_CONFIG = {
  /** Endpoints de la API */
  ENDPOINTS: {
    CATEGORIES: '/categories',
    PRODUCTS: '/products'
  },
  /** Timeout para peticiones HTTP (en milisegundos) */
  TIMEOUT: 30000,
  /** Número de intentos para reintentar peticiones fallidas */
  RETRY_ATTEMPTS: 3,
  /** Códigos de estado HTTP */
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  }
} as const;

/**
 * Mensajes de error HTTP estándar
 * @deprecated Usar ERROR_MESSAGES de messages.constants.ts
 */
export const HTTP_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  SERVER_ERROR: 'Error del servidor. Por favor, intenta más tarde.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  BAD_REQUEST: 'La solicitud contiene datos inválidos.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado.'
} as const;

