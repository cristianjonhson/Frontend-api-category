import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { API_CONFIG } from '../../../shared/constants';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { LoggerService } from '../../../core/services/logger.service';
import {
  IPurchaseOrder,
  IPurchaseOrderCreateRequest,
  IPurchaseOrderReceiveRequest
} from '../../../shared/interfaces/purchase.interface';

// Shapes internos de la respuesta de la API — no exportados
interface RawPurchaseOrderItem {
  id?: number;
  productId?: number;
  productName?: string;
  orderedQuantity?: number;
  receivedQuantity?: number;
  pendingQuantity?: number;
}

interface RawPurchaseOrder {
  id?: number;
  orderNumber?: string;
  supplierId?: number;
  supplierName?: string;
  status?: string;
  expectedDate?: string;
  createdAt?: string;
  receivedAt?: string;
  items?: RawPurchaseOrderItem[];
}

interface PurchaseOrderApiBody {
  purchaseOrderResponse?: {
    purchaseOrder?: RawPurchaseOrder[] | RawPurchaseOrder;
  };
}

const baseUrl = environment.base_uri;

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private readonly logCtx = '[Purchase][PurchaseOrderService]';

  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}

  getPurchaseOrders(): Observable<IPurchaseOrder[]> {
    const endpoint = `${baseUrl}${API_CONFIG.ENDPOINTS.PURCHASE_ORDERS}`;

    return this.http.get<ApiResponse<PurchaseOrderApiBody>>(endpoint).pipe(
      map((response) => this.processGetPurchaseOrdersResponse(response)),
      catchError((err) => {
        this.logger.error(`${this.logCtx} Error al obtener órdenes de compra`, err);
        return throwError(() => err);
      })
    );
  }

  createPurchaseOrder(payload: IPurchaseOrderCreateRequest): Observable<IPurchaseOrder> {
    const endpoint = `${baseUrl}${API_CONFIG.ENDPOINTS.PURCHASE_ORDERS}`;
    const options = {
      headers: {
        [API_CONFIG.HEADERS.SKIP_GLOBAL_ERROR]: 'true'
      }
    };

    return this.http.post<ApiResponse<PurchaseOrderApiBody>>(endpoint, payload, options).pipe(
      map((response) => this.processSinglePurchaseOrderResponse(response)),
      catchError((err) => {
        this.logger.error(`${this.logCtx} Error al crear orden de compra`, err);
        return throwError(() => err);
      })
    );
  }

  receivePurchaseOrder(id: number, payload: IPurchaseOrderReceiveRequest): Observable<IPurchaseOrder> {
    const endpoint = `${baseUrl}${API_CONFIG.ENDPOINTS.PURCHASE_ORDERS}/${id}/receive`;
    const options = {
      headers: {
        [API_CONFIG.HEADERS.SKIP_GLOBAL_ERROR]: 'true'
      }
    };

    return this.http.post<ApiResponse<PurchaseOrderApiBody>>(endpoint, payload, options).pipe(
      map((response) => this.processSinglePurchaseOrderResponse(response)),
      catchError((err) => {
        this.logger.error(`${this.logCtx} Error al recibir orden de compra`, err);
        return throwError(() => err);
      })
    );
  }

  private processGetPurchaseOrdersResponse(response: ApiResponse<PurchaseOrderApiBody>): IPurchaseOrder[] {
    const body = response as unknown as PurchaseOrderApiBody;
    const raw = body?.purchaseOrderResponse?.purchaseOrder;
    const list: RawPurchaseOrder[] = Array.isArray(raw) ? raw : [];
    return list.map((order) => this.normalizeOrder(order));
  }

  private processSinglePurchaseOrderResponse(response: ApiResponse<PurchaseOrderApiBody>): IPurchaseOrder {
    const body = response as unknown as PurchaseOrderApiBody;
    const raw = body?.purchaseOrderResponse?.purchaseOrder;
    const single: RawPurchaseOrder | undefined = Array.isArray(raw) ? raw[0] : raw;
    return this.normalizeOrder(single ?? ({} as RawPurchaseOrder));
  }

  private normalizeOrder(order: RawPurchaseOrder): IPurchaseOrder {
    const items = Array.isArray(order?.items) ? order.items : [];

    return {
      id: order?.id,
      orderNumber: order?.orderNumber ?? '',
      supplierId: order?.supplierId ?? 0,
      supplierName: order?.supplierName ?? '',
      status: order?.status ?? 'PENDING',
      expectedDate: order?.expectedDate,
      createdAt: order?.createdAt,
      receivedAt: order?.receivedAt,
      items: items.map((item) => ({
        id: item?.id,
        productId: item?.productId ?? 0,
        productName: item?.productName ?? '',
        orderedQuantity: item?.orderedQuantity ?? 0,
        receivedQuantity: item?.receivedQuantity ?? 0,
        pendingQuantity: item?.pendingQuantity ?? Math.max((item?.orderedQuantity ?? 0) - (item?.receivedQuantity ?? 0), 0)
      }))
    };
  }
}
