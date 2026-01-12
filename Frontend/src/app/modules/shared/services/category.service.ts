import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CategoryModel, CategoryRequest, CategoryResponse } from 'src/app/shared/models/category.model';
import { ApiResponse } from 'src/app/shared/models/api-response.model';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { API_CONSTANTS } from 'src/app/shared/constants/api.constants';
import { ApiResponseCode } from 'src/app/shared/enums/api-response-code.enum';
import { LoggerService } from 'src/app/core/services/logger.service';

// Call environment, declare constant
const base_url = environment.base_uri;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) { }

  /**
   * Obtiene todas las categorías
   * @returns Observable con array de categorías procesadas
   */
  getCategories(): Observable<ICategory[]> {
    const endpoint = `${base_url}${API_CONSTANTS.ENDPOINTS.CATEGORIES}`;

    return this.http.get<ApiResponse<CategoryResponse>>(endpoint).pipe(
      map(response => this.processGetCategoriesResponse(response))
    );
  }

  /**
   * Guarda una nueva categoría
   * @param body Datos de la categoría a guardar
   * @returns Observable con la respuesta procesada
   */
  saveCategory(body: CategoryRequest): Observable<ApiResponse<CategoryResponse>> {
    const endpoint = `${base_url}${API_CONSTANTS.ENDPOINTS.CATEGORIES}`;
    this.logger.info('Guardando categoría:', body);
    return this.http.post<ApiResponse<CategoryResponse>>(endpoint, body);
  }

  /**
   * Crea una nueva categoría
   * @param category Datos de la nueva categoría
   * @returns Observable con la respuesta de la API
   */
  createCategory(category: CategoryRequest): Observable<ApiResponse<CategoryResponse>> {
    const endpoint = `${base_url}${API_CONSTANTS.ENDPOINTS.CATEGORIES}`;
    this.logger.info('Creando nueva categoría:', category);
    return this.http.post<ApiResponse<CategoryResponse>>(endpoint, category).pipe(
      catchError(error => {
        this.logger.error('Error al crear categoría:', error);
        throw error;
      })
    );
  }

  /**
   * Procesa la respuesta de obtener categorías
   * Lógica de negocio movida del componente al servicio
   * @param response Respuesta de la API
   * @returns Array de categorías o array vacío
   */
  private processGetCategoriesResponse(response: any): ICategory[] {
    if (!response.metadata || response.metadata.length === 0) {
      this.logger.warn('Respuesta sin metadata');
      return [];
    }

    const code = response.metadata[0].code;

    if (code !== ApiResponseCode.SUCCESS) {
      this.logger.warn('Respuesta no exitosa:', code);
      return [];
    }

    const categories = response.categoryResponse?.category || [];
    this.logger.debug('Categorías procesadas:', categories);

    return categories;
  }

  /**
   * Valida si una categoría tiene datos válidos
   * @param category Categoría a validar
   * @returns true si es válida
   */
  validateCategory(category: CategoryRequest): boolean {
    return !!(category.name?.trim() && category.description?.trim());
  }
}
