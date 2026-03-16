import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { API_CONFIG } from '../../../shared/constants';
import { IProduct, IProductRequest } from '../../../shared/interfaces/product.interface';
import { ProductApiBody, RawProduct } from '../../../shared/interfaces/product-api-response.interface';

const base_url = environment.base_uri;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<IProduct[]> {
    const endpoint = `${base_url}${API_CONFIG.ENDPOINTS.PRODUCTS}`;

    return this.http.get<ApiResponse<ProductApiBody>>(endpoint).pipe(
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
      categoryId: payload?.categoryId,
      supplierId: payload?.supplierId
    };

    return this.http.post<ApiResponse<ProductApiBody>>(endpoint, requestBody, options).pipe(
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
      categoryId: payload?.categoryId,
      supplierId: payload?.supplierId
    };

    return this.http.put<ApiResponse<ProductApiBody>>(endpoint, requestBody, options).pipe(
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

  private processGetProductsResponse(response: ApiResponse<ProductApiBody>): IProduct[] {
    const body = response as unknown as ProductApiBody;
    const raw = body?.productResponse?.product;
    const list: RawProduct[] = Array.isArray(raw) ? raw : [];
    return list.map((product) => this.normalizeProduct(product));
  }

  private processCreateProductResponse(response: ApiResponse<ProductApiBody>, fallback: IProductRequest): IProduct {
    const body = response as unknown as ProductApiBody;
    const raw = body?.productResponse?.product;
    const single: RawProduct | undefined = Array.isArray(raw) ? raw[0] : raw;
    return this.normalizeProduct(single ?? fallback);
  }

  private normalizeProduct(product: RawProduct): IProduct {
    if (!product) {
      return { name: '', price: 0, quantity: 0, categoryName: '', category: '' };
    }

    const cat = product.category;
    const catObj = typeof cat === 'object' ? cat : undefined;
    const categoryName = product.categoryName
      ?? catObj?.name
      ?? (typeof cat === 'string' ? cat : undefined)
      ?? '';

    return {
      id: product.id,
      name: product.name ?? '',
      price: product.price ?? 0,
      quantity: product.quantity ?? 0,
      categoryId: product.categoryId ?? catObj?.id,
      categoryName,
      supplierId: product.supplierId,
      supplierName: product.supplierName,
      category: categoryName
    };
  }

}
