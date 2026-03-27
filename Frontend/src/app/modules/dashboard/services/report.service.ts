import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { API_CONFIG } from '../../../shared/constants';
import { LoggerService } from '../../../core/services/logger.service';

const base_url = environment.base_uri;

export interface IReport {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalPurchaseOrders: number;
  totalStock: number;
  lowStockProducts: IProductLowStock[];
  supplierProductCount: ISupplierProductCount[];
}

export interface IProductLowStock {
  id: number;
  name: string;
  categoryName: string;
  quantity: number;
  price: number;
}

export interface ISupplierProductCount {
  id: number;
  name: string;
  productCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly logCtx = '[Report][ReportService]';

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) { }

  /**
   * Obtiene el reporte básico del inventario
   */
  getBasicReport(): Observable<IReport> {
    const endpoint = `${base_url}${API_CONFIG.ENDPOINTS.REPORTS}/basic`;

    return this.http.get<ApiResponse<IReport>>(endpoint).pipe(
      map((response) => {
        const body = response as unknown as {
          reportResponse?: { report?: IReport };
        };
        return body?.reportResponse?.report || ({} as IReport);
      }),
      catchError((err) => {
        this.logger.error(`${this.logCtx} Error al obtener reporte básico`, err);
        return throwError(() => err);
      })
    );
  }
}
