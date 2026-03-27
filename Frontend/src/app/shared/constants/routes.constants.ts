/**
 * Constantes de rutas de la aplicación
 */
export const ROUTES = {
  ROOT: '',
  DASHBOARD: 'dashboard',
  HOME: 'home',
  CATEGORY: 'category',
  PRODUCT: 'product',
  STOCK: 'stock',
  SUPPLIER: 'supplier',
  PURCHASE: 'purchase',
  REPORTS: 'reports',
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
  STOCK: `/${ROUTES.DASHBOARD}/${ROUTES.STOCK}`,
  SUPPLIER: `/${ROUTES.DASHBOARD}/${ROUTES.SUPPLIER}`,
  PURCHASE: `/${ROUTES.DASHBOARD}/${ROUTES.PURCHASE}`,
  REPORTS: `/${ROUTES.DASHBOARD}/${ROUTES.REPORTS}`,
  CATEGORIES_NEW: '/categories/new'
} as const;
