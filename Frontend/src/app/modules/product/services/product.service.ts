import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiResponse } from 'src/app/shared/models/api-response.model';
import { API_CONFIG } from 'src/app/shared/constants';
import { IProduct, IProductRequest } from 'src/app/shared/interfaces/product.interface';

const base_url = environment.base_uri;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<IProduct[]> {
    const endpoint = `${base_url}${API_CONFIG.ENDPOINTS.PRODUCTS}`;

    return this.http.get<ApiResponse<any>>(endpoint).pipe(
      map((response) => this.processGetProductsResponse(response)),
      catchError((err) => throwError(() => err))
    );
  }

  createProduct(payload: IProductRequest): Observable<IProduct> {
    const endpoint = `${base_url}${API_CONFIG.ENDPOINTS.PRODUCTS}`;
    const options = {
      headers: {
        [API_CONFIG.HEADERS.SKIP_GLOBAL_ERROR]: 'true'
      }
    };
    const requestBody: IProductRequest = {
      name: payload?.name,
      price: payload?.price,
      quantity: payload?.quantity,
      categoryId: payload?.categoryId
    };

    return this.http.post<ApiResponse<any>>(endpoint, requestBody, options).pipe(
      map((response) => this.processCreateProductResponse(response, requestBody)),
      catchError((err) => throwError(() => err))
    );
  }

  updateProduct(id: number, payload: IProductRequest): Observable<IProduct> {
    const endpoint = `${base_url}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`;
    const options = {
      headers: {
        [API_CONFIG.HEADERS.SKIP_GLOBAL_ERROR]: 'true'
      }
    };
    const requestBody: IProductRequest = {
      name: payload?.name,
      price: payload?.price,
      quantity: payload?.quantity,
      categoryId: payload?.categoryId
    };

    return this.http.put<ApiResponse<any>>(endpoint, requestBody, options).pipe(
      map((response) => this.processCreateProductResponse(response, requestBody)),
      catchError((err) => throwError(() => err))
    );
  }

  deleteProduct(id: number): Observable<void> {
    const endpoint = `${base_url}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`;
    const options = {
      headers: {
        [API_CONFIG.HEADERS.SKIP_GLOBAL_ERROR]: 'true'
      }
    };

    return this.http.delete<void>(endpoint, options).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  private processGetProductsResponse(response: ApiResponse<any>): IProduct[] {
    const products = response?.productResponse?.product ?? [];
    return products.map((product: any) => this.normalizeProduct(product));
  }

  private processCreateProductResponse(response: ApiResponse<any>, fallback: IProductRequest): IProduct {
    const created = response?.productResponse?.product?.[0]
      ?? response?.productResponse?.product
      ?? response?.productResponse
      ?? fallback;

    return this.normalizeProduct(created);
  }

  private normalizeProduct(product: any): IProduct {
    if (!product) {
      return {
        name: '',
        price: 0,
        quantity: 0,
        categoryName: '',
        category: ''
      };
    }

    const categoryName = product?.categoryName
      ?? product?.category?.name
      ?? product?.category
      ?? '';

    return {
      id: product?.id,
      name: product?.name,
      price: product?.price,
      quantity: product?.quantity,
      categoryId: product?.categoryId ?? product?.category?.id,
      categoryName,
      category: categoryName
    };
  }

}
