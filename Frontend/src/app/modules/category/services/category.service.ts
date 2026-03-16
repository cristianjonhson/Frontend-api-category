import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CategoryRequest, CategoryResponse } from '../../../shared/models/category.model';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { ICategory } from '../../../shared/interfaces/category.interface';
import { API_CONFIG } from '../../../shared/constants/api.constants';
import { ApiResponseCode } from '../../../shared/enums/api-response-code.enum';
import { LoggerService } from '../../../core/services/logger.service';

// Call environment, declare constant
const base_url = environment.base_uri;

@Injectable({ providedIn: 'root' })
export class CategoryService {

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}

  /**
   * Obtiene todas las categorías
   * @returns Observable con array de categorías procesadas
   */
  getCategories(): Observable<ICategory[]> {
    const endpoint = `${base_url}${API_CONFIG.ENDPOINTS.CATEGORIES}`;

    return this.http.get<ApiResponse<CategoryResponse>>(endpoint).pipe(
      map(res => this.processGetCategoriesResponse(res)),
      catchError(err => {
        this.logger.error('[Category][CategoryService] Error al obtener categorías:', err);
        return of([]);
      })
    );
  }

  /**
   * Crea una nueva categoría
   * @param category Datos de la nueva categoría
   * @returns Observable con la respuesta de la API
   */
  createCategory(body: CategoryRequest): Observable<ApiResponse<CategoryResponse>> {
    const endpoint = `${base_url}${API_CONFIG.ENDPOINTS.CATEGORIES}`;
    const options = {
      headers: {
        [API_CONFIG.HEADERS.SKIP_GLOBAL_ERROR]: 'true'
      }
    };

    return this.http.post<ApiResponse<CategoryResponse>>(endpoint, body, options).pipe(
      tap(() => this.logger.info('[Category][CategoryService] Creando nueva categoría:', body)),
      catchError(err => {
        this.logger.error('[Category][CategoryService] Error al crear categoría:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Actualiza una categoría por id
   * @param id Identificador de la categoría
   * @param body Datos de la categoría
   */
  updateCategory(id: number, body: CategoryRequest): Observable<ApiResponse<CategoryResponse>> {
    const endpoint = `${base_url}${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`;
    const options = {
      headers: {
        [API_CONFIG.HEADERS.SKIP_GLOBAL_ERROR]: 'true'
      }
    };

    return this.http.put<ApiResponse<CategoryResponse>>(endpoint, body, options).pipe(
      tap(() => this.logger.info('[Category][CategoryService] Actualizando categoría:', id)),
      catchError(err => {
        this.logger.error('[Category][CategoryService] Error al actualizar categoría:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Elimina una categoría por id
   * @param id Identificador de la categoría
   */
  deleteCategory(id: number): Observable<void> {
    const endpoint = `${base_url}${API_CONFIG.ENDPOINTS.CATEGORIES}/${id}`;
    const options = {
      headers: {
        [API_CONFIG.HEADERS.SKIP_GLOBAL_ERROR]: 'true'
      }
    };

    return this.http.delete<void>(endpoint, options).pipe(
      tap(() => this.logger.info('[Category][CategoryService] Eliminando categoría:', id)),
      catchError(err => {
        this.logger.error('[Category][CategoryService] Error al eliminar categoría:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Procesa la respuesta de obtener categorías
   * Lógica de negocio movida del componente al servicio
   * @param response Respuesta de la API
   * @returns Array de categorías o array vacío
   */
  private processGetCategoriesResponse(response: ApiResponse<CategoryResponse>): ICategory[] {
    const code = response?.metadata?.[0]?.code;

    if (code !== ApiResponseCode.SUCCESS) {
      this.logger.warn('[Category][CategoryService] Respuesta no exitosa:', code);
      return [];
    }

    return response.categoryResponse?.category ?? [];
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
