import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { API_CONFIG } from '../../../shared/constants';
import { IProduct, IProductRequest } from '../../../shared/interfaces/product.interface';
import { ProductApiBody, RawProduct } from '../../../shared/interfaces';

const base_url = environment.base_uri;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getCategoryName(product: IProduct): string {
    if (typeof product?.category === 'string') {
      return product.category.trim();
    }

    return (product?.categoryName ?? product?.category?.name ?? '').toString().trim();
  }

  getSupplierName(product: IProduct): string {
    return (product?.supplierName ?? '').toString().trim();
  }

  buildCategoriesFallback(products: IProduct[], categories: string[]): string[] {
    const derivedCategories = Array.from(
      new Set(
        products
          .map((product: IProduct) => this.getCategoryName(product))
          .filter(Boolean)
      )
    ).sort();

    if (categories.length === 0) {
      return derivedCategories;
    }

    return Array.from(new Set([...categories, ...derivedCategories]))
      .sort((a, b) => a.localeCompare(b));
  }

  buildSuppliersFallback(products: IProduct[], suppliers: string[]): string[] {
    const derivedSuppliers = Array.from(
      new Set(
        products
          .map((product: IProduct) => this.getSupplierName(product))
          .filter(Boolean)
      )
    ).sort();

    if (suppliers.length === 0) {
      return derivedSuppliers;
    }

    return Array.from(new Set([...suppliers, ...derivedSuppliers]))
      .sort((a, b) => a.localeCompare(b));
  }

  filterProducts(products: IProduct[], search: string, category: string, supplier: string): IProduct[] {
    const normalizedTerm = search.toLowerCase().trim();
    const selectedCategory = category.trim();
    const selectedSupplier = supplier.trim();

    return products.filter((product: IProduct) => {
      const name = (product?.name ?? '').toString().toLowerCase();
      const categoryName = this.getCategoryName(product);
      const supplierName = this.getSupplierName(product);

      const matchesName = !normalizedTerm || name.includes(normalizedTerm);
      const matchesCategory = !selectedCategory || categoryName === selectedCategory;
      const matchesSupplier = !selectedSupplier || supplierName === selectedSupplier;

      return matchesName && matchesCategory && matchesSupplier;
    });
  }

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
