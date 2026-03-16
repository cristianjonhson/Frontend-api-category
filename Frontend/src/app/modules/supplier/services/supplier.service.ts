import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { API_CONFIG } from '../../../shared/constants/api.constants';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { ISupplier, ISupplierRequest } from '../../../shared/interfaces/supplier.interface';
import { LoggerService } from '../../../core/services/logger.service';

// Shapes internos de la respuesta de la API — no exportados
interface RawSupplierProduct {
  id?: number;
  name?: string;
  categoryName?: string;
}

interface RawSupplier {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  products?: RawSupplierProduct[];
}

interface SupplierApiBody {
  supplierResponse?: {
    supplier?: RawSupplier[] | RawSupplier;
  };
}

const baseUrl = environment.base_uri;

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private readonly logCtx = '[Supplier][SupplierService]';

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}

  getSuppliers(): Observable<ISupplier[]> {
    const endpoint = `${baseUrl}${API_CONFIG.ENDPOINTS.SUPPLIERS}`;

    return this.http.get<ApiResponse<SupplierApiBody>>(endpoint).pipe(
      map((response) => this.processGetSuppliersResponse(response)),
      catchError((err) => {
        this.logger.error(`${this.logCtx} Error al obtener proveedores`, err);
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

    return this.http.post<ApiResponse<SupplierApiBody>>(endpoint, payload, options).pipe(
      map((response) => this.processSingleSupplierResponse(response, payload)),
      catchError((err) => {
        this.logger.error(`${this.logCtx} Error al crear proveedor`, err);
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

    return this.http.put<ApiResponse<SupplierApiBody>>(endpoint, payload, options).pipe(
      map((response) => this.processSingleSupplierResponse(response, payload)),
      catchError((err) => {
        this.logger.error(`${this.logCtx} Error al actualizar proveedor`, err);
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
        this.logger.error(`${this.logCtx} Error al eliminar proveedor`, err);
        return throwError(() => err);
      })
    );
  }

  private processGetSuppliersResponse(response: ApiResponse<SupplierApiBody>): ISupplier[] {
    const body = response as unknown as SupplierApiBody;
    const raw = body?.supplierResponse?.supplier;
    const list: RawSupplier[] = Array.isArray(raw) ? raw : [];
    return list.map((supplier) => this.normalizeSupplier(supplier));
  }

  private processSingleSupplierResponse(response: ApiResponse<SupplierApiBody>, fallback: ISupplierRequest): ISupplier {
    const body = response as unknown as SupplierApiBody;
    const raw = body?.supplierResponse?.supplier;
    const single: RawSupplier | undefined = Array.isArray(raw) ? raw[0] : raw;
    return this.normalizeSupplier(single ?? fallback);
  }

  private normalizeSupplier(supplier: RawSupplier): ISupplier {
    const products = Array.isArray(supplier?.products) ? supplier.products : [];

    return {
      id: supplier?.id,
      name: supplier?.name ?? '',
      email: supplier?.email ?? '',
      phone: supplier?.phone ?? '',
      products: products.map((product) => ({
        id: product?.id,
        name: product?.name ?? '',
        categoryName: product?.categoryName ?? ''
      }))
    };
  }
}
