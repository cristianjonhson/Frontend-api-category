import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { API_CONFIG } from '../../../shared/constants/api.constants';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { ISupplier, ISupplierRequest } from '../../../shared/interfaces/supplier.interface';
import { LoggerService } from '../../../core/services/logger.service';

const baseUrl = environment.base_uri;

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}

  getSuppliers(): Observable<ISupplier[]> {
    const endpoint = `${baseUrl}${API_CONFIG.ENDPOINTS.SUPPLIERS}`;

    return this.http.get<ApiResponse<any>>(endpoint).pipe(
      map((response) => this.processGetSuppliersResponse(response)),
      catchError((err) => {
        this.logger.error('[Supplier] Error al obtener proveedores', err);
        return throwError(() => err);
      })
    );
  }

  createSupplier(payload: ISupplierRequest): Observable<ISupplier> {
    const endpoint = `${baseUrl}${API_CONFIG.ENDPOINTS.SUPPLIERS}`;
    const options = {
      headers: {
        [API_CONFIG.HEADERS.SKIP_GLOBAL_ERROR]: 'true'
      }
    };

    return this.http.post<ApiResponse<any>>(endpoint, payload, options).pipe(
      map((response) => this.processSingleSupplierResponse(response, payload)),
      catchError((err) => {
        this.logger.error('[Supplier] Error al crear proveedor', err);
        return throwError(() => err);
      })
    );
  }

  updateSupplier(id: number, payload: ISupplierRequest): Observable<ISupplier> {
    const endpoint = `${baseUrl}${API_CONFIG.ENDPOINTS.SUPPLIERS}/${id}`;
    const options = {
      headers: {
        [API_CONFIG.HEADERS.SKIP_GLOBAL_ERROR]: 'true'
      }
    };

    return this.http.put<ApiResponse<any>>(endpoint, payload, options).pipe(
      map((response) => this.processSingleSupplierResponse(response, payload)),
      catchError((err) => {
        this.logger.error('[Supplier] Error al actualizar proveedor', err);
        return throwError(() => err);
      })
    );
  }

  deleteSupplier(id: number): Observable<void> {
    const endpoint = `${baseUrl}${API_CONFIG.ENDPOINTS.SUPPLIERS}/${id}`;
    const options = {
      headers: {
        [API_CONFIG.HEADERS.SKIP_GLOBAL_ERROR]: 'true'
      }
    };

    return this.http.delete<void>(endpoint, options).pipe(
      catchError((err) => {
        this.logger.error('[Supplier] Error al eliminar proveedor', err);
        return throwError(() => err);
      })
    );
  }

  private processGetSuppliersResponse(response: ApiResponse<any>): ISupplier[] {
    const suppliers = response?.supplierResponse?.supplier ?? [];
    return suppliers.map((supplier: any) => this.normalizeSupplier(supplier));
  }

  private processSingleSupplierResponse(response: ApiResponse<any>, fallback: ISupplierRequest): ISupplier {
    const supplier = response?.supplierResponse?.supplier?.[0]
      ?? response?.supplierResponse?.supplier
      ?? fallback;

    return this.normalizeSupplier(supplier);
  }

  private normalizeSupplier(supplier: any): ISupplier {
    const products = Array.isArray(supplier?.products) ? supplier.products : [];

    return {
      id: supplier?.id,
      name: supplier?.name ?? '',
      email: supplier?.email ?? '',
      phone: supplier?.phone ?? '',
      products: products.map((product: any) => ({
        id: product?.id,
        name: product?.name ?? '',
        categoryName: product?.categoryName ?? ''
      }))
    };
  }
}
