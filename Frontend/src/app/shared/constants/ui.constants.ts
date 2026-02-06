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

/**
 * Colores para SweetAlert
 */
export const SWEET_ALERT_COLORS = {
  CONFIRM: '#d33',
  CANCEL: '#3085d6'
} as const;

/**
 * Configuracion base para SweetAlert
 */
export const SWEET_ALERT_CONFIG = {
  SUCCESS_TIMER: 1800,
  SHOW_CONFIRM_BUTTON: false,
  REVERSE_BUTTONS: true,
  FOCUS_CANCEL: true
} as const;
