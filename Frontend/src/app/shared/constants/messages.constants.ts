/**
 * Constantes de mensajes de la aplicación
 */

/**
 * Mensajes de notificación de éxito
 */
export const SUCCESS_MESSAGES = {
  // Categorías
  CATEGORY_CREATED: 'Categoría agregada exitosamente',
  CATEGORY_UPDATED: 'Categoría actualizada exitosamente',
  CATEGORY_DELETED: 'Categoría eliminada exitosamente',

  // Productos
  PRODUCT_CREATED: 'Producto agregado exitosamente',
  PRODUCT_UPDATED: 'Producto actualizado exitosamente',
  PRODUCT_DELETED: 'Producto eliminado exitosamente',

  // Genéricos
  SAVE_SUCCESS: 'Cambios guardados exitosamente',
  OPERATION_SUCCESS: 'Operación completada exitosamente'
} as const;

/**
 * Mensajes de notificación de error
 */
export const ERROR_MESSAGES = {
  // Errores de red
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  SERVER_ERROR: 'Error del servidor. Por favor, intenta más tarde.',
  TIMEOUT_ERROR: 'La operación tardó demasiado tiempo. Por favor, intenta nuevamente.',

  // Errores de autorización
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  FORBIDDEN: 'Acceso denegado.',

  // Errores de recursos
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',

  // Errores de validación
  BAD_REQUEST: 'La solicitud contiene datos inválidos.',
  VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',

  // Errores específicos de entidades
  CATEGORY_LOAD_ERROR: 'Error al cargar categorías',
  CATEGORY_CREATE_ERROR: 'Error al crear categoría',
  CATEGORY_UPDATE_ERROR: 'Error al actualizar categoría',
  CATEGORY_DELETE_ERROR: 'Error al eliminar categoría',

  PRODUCT_LOAD_ERROR: 'Error al cargar productos',
  PRODUCT_CREATE_ERROR: 'Error al crear producto',
  PRODUCT_UPDATE_ERROR: 'Error al actualizar producto',
  PRODUCT_DELETE_ERROR: 'Error al eliminar producto',

  // Genéricos
  UNKNOWN_ERROR: 'Ocurrió un error inesperado.',
  OPERATION_FAILED: 'No se pudo completar la operación.'
} as const;

/**
 * Mensajes informativos
 */
export const INFO_MESSAGES = {
  NO_CATEGORIES: 'No se encontraron categorías',
  NO_PRODUCTS: 'No se encontraron productos',
  NO_RESULTS: 'No se encontraron resultados',
  LOADING: 'Cargando...',
  EMPTY_LIST: 'La lista está vacía'
} as const;

/**
 * Mensajes de confirmación para acciones destructivas
 * @param entityName Nombre de la entidad a eliminar
 * @returns Mensaje de confirmación
 */
export const CONFIRMATION_MESSAGES = {
  /**
   * Genera un mensaje de confirmación para eliminar una categoría
   * @param categoryName Nombre de la categoría
   * @returns Mensaje de confirmación
   */
  DELETE_CATEGORY: (categoryName: string) => `¿Eliminar la categoría "${categoryName}"?`,

  /**
   * Genera un mensaje de confirmación para eliminar un producto
   * @param productName Nombre del producto
   * @returns Mensaje de confirmación
   */
  DELETE_PRODUCT: (productName: string) => `¿Eliminar el producto "${productName}"?`,

  /**
   * Mensaje genérico de confirmación de eliminación
   */
  CONFIRM_DELETE: '¿Está seguro de que desea eliminar este elemento?',

  /**
   * Mensaje de confirmación para descartar cambios
   */
  DISCARD_CHANGES: '¿Descartar los cambios realizados?',

  /**
   * Mensaje de confirmación para cancelar operación
   */
  CANCEL_OPERATION: '¿Cancelar la operación en curso?'
} as const;

/**
 * Etiquetas de formularios y campos
 */
export const FORM_LABELS = {
  // Campos comunes
  NAME: 'Nombre',
  DESCRIPTION: 'Descripción',
  SEARCH: 'Buscar',
  ACTIONS: 'Acciones',

  // Categorías
  CATEGORY_NAME: 'Nombre de la categoría',
  CATEGORY_DESCRIPTION: 'Descripción de la categoría',
  SEARCH_CATEGORY: 'Buscar Categorias',
  ADD_CATEGORY: 'Agregar Nueva Categoría',
  EDIT_CATEGORY: 'Editar Categoría',

  // Productos
  PRODUCT_NAME: 'Nombre del producto',
  PRODUCT_DESCRIPTION: 'Descripción del producto',
  PRODUCT_PRICE: 'Precio',
  PRODUCT_QUANTITY: 'Cantidad',
  PRODUCT_CATEGORY: 'Categoría',
  SEARCH_PRODUCT: 'Buscar Productos',
  ADD_PRODUCT: 'Agregar Nuevo Producto',
  EDIT_PRODUCT: 'Editar Producto',

  // Botones
  SAVE: 'Guardar',
  CANCEL: 'Cancelar',
  DELETE: 'Eliminar',
  EDIT: 'Editar',
  CREATE: 'Crear',
  UPDATE: 'Actualizar',
  CLOSE: 'Cerrar'
} as const;

/**
 * Títulos de páginas y secciones
 */
export const PAGE_TITLES = {
  CATEGORY_LIST: 'Listado de Categorias',
  PRODUCT_LIST: 'Listado de Productos',
  DASHBOARD: 'Panel de Control'
} as const;

/**
 * Textos base para SweetAlert
 */
export const SWEET_ALERT_TEXTS = {
  TITLE_CONFIRM_DELETE: 'Confirmar eliminacion',
  TITLE_DELETING: (entityLabel: string) => `Eliminando ${entityLabel}...`,
  TITLE_CREATED: 'Creado',
  TITLE_UPDATED: 'Actualizado',
  TITLE_DELETED: 'Eliminado',
  TITLE_ERROR: 'Error',
  BUTTON_CONFIRM_DELETE: 'Si, eliminar',
  BUTTON_CANCEL: 'Cancelar'
} as const;
