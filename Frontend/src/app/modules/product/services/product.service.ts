import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { API_CONFIG, SKIP_GLOBAL_ERROR_HTTP_OPTIONS } from '../../../shared/constants';
import { IProduct, IProductRequest } from '../../../shared/interfaces/product.interface';
import { ProductApiBody, RawProduct } from '../../../shared/interfaces';
import { IStockRow } from '../components/interfaces';

const base_url = environment.base_uri;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  mapProductsToStockRows(products: IProduct[], defaultMinStock: number, defaultMaxStock: number): IStockRow[] {
    return products.map((product) => {
      const currentStock = Number(product?.quantity ?? 0);
      const availableStock = Math.max(currentStock - defaultMinStock, 0);

      return {
        productName: (product?.name ?? '').toString(),
        currentStock,
        minStock: defaultMinStock,
        maxStock: defaultMaxStock,
        availableStock
      };
    });
  }

  private getCategoryName(product: IProduct): string {
    if (typeof product?.category === 'string') {
      return product.category.trim();
    }

    return (product?.categoryName ?? product?.category?.name ?? '').toString().trim();
  }

  private getSupplierName(product: IProduct): string {
    return (product?.supplierName ?? '').toString().trim();
  }

  buildCategoriesFallback(products: IProduct[], categories: string[]): string[] {
    return this.buildLabelsFallback(products, categories, (product) => this.getCategoryName(product));
  }

  buildSuppliersFallback(products: IProduct[], suppliers: string[]): string[] {
    return this.buildLabelsFallback(products, suppliers, (product) => this.getSupplierName(product));
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
    const requestBody: IProductRequest = {
      name: payload?.name,
      price: payload?.price,
      quantity: payload?.quantity,
      categoryId: payload?.categoryId,
      supplierId: payload?.supplierId
    };

    return this.http.post<ApiResponse<ProductApiBody>>(endpoint, requestBody, SKIP_GLOBAL_ERROR_HTTP_OPTIONS).pipe(
      map((response) => this.processCreateProductResponse(response, requestBody)),
      catchError((err) => throwError(() => err))
    );
  }

  updateProduct(id: number, payload: IProductRequest): Observable<IProduct> {
    const endpoint = `${base_url}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`;
    const requestBody: IProductRequest = {
      name: payload?.name,
      price: payload?.price,
      quantity: payload?.quantity,
      categoryId: payload?.categoryId,
      supplierId: payload?.supplierId
    };

    return this.http.put<ApiResponse<ProductApiBody>>(endpoint, requestBody, SKIP_GLOBAL_ERROR_HTTP_OPTIONS).pipe(
      map((response) => this.processCreateProductResponse(response, requestBody)),
      catchError((err) => throwError(() => err))
    );
  }

  deleteProduct(id: number): Observable<void> {
    const endpoint = `${base_url}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`;

    return this.http.delete<void>(endpoint, SKIP_GLOBAL_ERROR_HTTP_OPTIONS).pipe(
      catchError((err) => throwError(() => err))
    );
  }

  private processGetProductsResponse(response: ApiResponse<ProductApiBody>): IProduct[] {
    const body = response as unknown as ProductApiBody;
    const raw = body?.productResponse?.product;
    const list: RawProduct[] = Array.isArray(raw) ? raw : [];
    return list.map((product) => this.normalizeProduct(product));
  }

  private buildLabelsFallback(
    products: IProduct[],
    existingLabels: string[],
    getLabel: (product: IProduct) => string
  ): string[] {
    const derivedLabels = Array.from(
      new Set(
        products
          .map((product: IProduct) => getLabel(product))
          .filter(Boolean)
      )
    ).sort();

    if (existingLabels.length === 0) {
      return derivedLabels;
    }

    return Array.from(new Set([...existingLabels, ...derivedLabels]))
      .sort((a, b) => a.localeCompare(b));
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
