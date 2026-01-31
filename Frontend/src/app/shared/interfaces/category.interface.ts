/**
 * Interface para una categoría
 */
export interface ICategory {
  id?: number;
  name: string;
  description: string;
}

/**
 * Interface para el request de crear/actualizar categoría
 */
export interface ICategoryRequest {
  name: string;
  description: string;
}
