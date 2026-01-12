/**
 * Constantes de configuración de la API
 */
export const API_CONSTANTS = {
  ENDPOINTS: {
    CATEGORIES: '/categories',
    PRODUCTS: '/products'
  },
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

/**
 * Mensajes de error estándar
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  SERVER_ERROR: 'Error del servidor. Por favor, intenta más tarde.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  BAD_REQUEST: 'La solicitud contiene datos inválidos.',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado.'
};
