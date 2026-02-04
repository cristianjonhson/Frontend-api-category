/**
 * Constantes de configuración de diálogos
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
