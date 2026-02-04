/**
 * Constantes de configuración de la interfaz de usuario
 */

/**
 * Configuraciones de tiempo (en milisegundos)
 */
export const TIMING = {
  /** Tiempo de debounce para búsquedas y filtros */
  SEARCH_DEBOUNCE: 300,
  /** Duración de notificaciones toast */
  NOTIFICATION_DURATION: 3000,
  /** Timeout para peticiones HTTP */
  HTTP_TIMEOUT: 30000
} as const;

/**
 * Configuraciones de diálogos modales
 */
export const DIALOG_CONFIG = {
  /** Dimensiones para diálogos de formularios estándar */
  FORM: {
    width: '600px',
    height: '400px'
  },
  /** Dimensiones para diálogos de confirmación */
  CONFIRMATION: {
    width: '400px',
    maxWidth: '90vw'
  },
  /** Dimensiones para diálogos de creación de productos */
  PRODUCT_FORM: {
    width: '520px',
    disableClose: false
  }
} as const;

/**
 * Configuraciones del paginador
 */
export const PAGINATOR_CONFIG = {
  /** Opciones de elementos por página */
  PAGE_SIZE_OPTIONS: [5, 10, 20],
  /** Tamaño de página por defecto */
  DEFAULT_PAGE_SIZE: 10,
  /** Mostrar botones primera/última página */
  SHOW_FIRST_LAST_BUTTONS: true
} as const;

/**
 * Configuraciones de la tabla
 */
export const TABLE_CONFIG = {
  /** Clase CSS para celdas */
  CELL_CLASS: 'mat-cell'
} as const;

/**
 * Breakpoints responsivos (en píxeles)
 */
export const BREAKPOINTS = {
  /** Dispositivos móviles */
  MOBILE: 600,
  /** Tablets */
  TABLET: 960,
  /** Escritorio */
  DESKTOP: 1280
} as const;
