import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CategoryModel, CategoryRequest, CategoryResponse } from 'src/app/shared/models/category.model';
import { ApiResponse } from 'src/app/shared/models/api-response.model';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { API_CONSTANTS } from 'src/app/shared/constants/api.constants';

// Call environment, declare constant
const base_url = environment.base_uri;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las categorías
   * @returns Observable con la respuesta de categorías
   */
  getCategories(): Observable<ApiResponse<CategoryResponse>> {
    const endpoint = `${base_url}${API_CONSTANTS.ENDPOINTS.CATEGORIES}`;
    return this.http.get<ApiResponse<CategoryResponse>>(endpoint);
  }

  /**
   * Guarda una nueva categoría
   * @param body Datos de la categoría a guardar
   * @returns Observable con la respuesta
   */
  saveCategory(body: CategoryRequest): Observable<ApiResponse<CategoryResponse>> {
    const endpoint = `${base_url}${API_CONSTANTS.ENDPOINTS.CATEGORIES}`;
    return this.http.post<ApiResponse<CategoryResponse>>(endpoint, body);
  }
}
