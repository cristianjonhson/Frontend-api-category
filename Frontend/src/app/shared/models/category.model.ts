import { ICategory } from '../interfaces/category.interface';

/**
 * Modelo para la entidad Categoría
 */
export class CategoryModel implements ICategory {
  id: number;
  name: string;
  description: string;

  constructor(data: Partial<CategoryModel> = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.description = data.description || '';
  }

  /**
   * Valida si la categoría tiene datos válidos
   */
  isValid(): boolean {
    return this.name.trim().length > 0 && this.description.trim().length > 0;
  }
}

/**
 * Modelo para el request de categoría
 */
export class CategoryRequest {
  name: string;
  description: string;

  constructor(data: Partial<CategoryRequest> = {}) {
    this.name = data.name || '';
    this.description = data.description || '';
  }
}

/**
 * Modelo para la respuesta de categorías
 */
export class CategoryResponse {
  category: CategoryModel[];

  constructor(data: any = {}) {
    this.category = data.category?.map((cat: any) => new CategoryModel(cat)) || [];
  }
}
