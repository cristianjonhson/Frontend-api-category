import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CategoryRequest, CategoryResponse } from 'src/app/shared/models/category.model';
import { ApiResponse } from 'src/app/shared/models/api-response.model';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { API_CONSTANTS } from 'src/app/shared/constants/api.constants';
import { ApiResponseCode } from 'src/app/shared/enums/api-response-code.enum';
import { LoggerService } from 'src/app/core/services/logger.service';

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
    const endpoint = `${base_url}${API_CONSTANTS.ENDPOINTS.CATEGORIES}`;

    return this.http.get<ApiResponse<CategoryResponse>>(endpoint).pipe(
      map(res => this.processGetCategoriesResponse(res)),
      catchError(err => {
        this.logger.error('Error al obtener categorías:', err);
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
    const endpoint = `${base_url}${API_CONSTANTS.ENDPOINTS.CATEGORIES}`;

    return this.http.post<ApiResponse<CategoryResponse>>(endpoint, body).pipe(
      tap(() => this.logger.info('Creando nueva categoría:', body)),
      catchError(err => {
        this.logger.error('Error al crear categoría:', err);
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
      this.logger.warn('Respuesta no exitosa:', code);
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
