/**
 * Constantes de rutas de la aplicación
 */
export const ROUTES = {
  ROOT: '',
  DASHBOARD: 'dashboard',
  HOME: 'home',
  CATEGORY: 'category',
  PRODUCT: 'product',
  WILDCARD: '**'
} as const;

/**
 * Rutas absolutas para navegación programática
 */
export const ROUTE_PATHS = {
  DASHBOARD: `/${ROUTES.DASHBOARD}`,
  HOME: `/${ROUTES.DASHBOARD}/${ROUTES.HOME}`,
  CATEGORY: `/${ROUTES.DASHBOARD}/${ROUTES.CATEGORY}`,
  PRODUCT: `/${ROUTES.DASHBOARD}/${ROUTES.PRODUCT}`,
  CATEGORIES_NEW: '/categories/new'
} as const;
