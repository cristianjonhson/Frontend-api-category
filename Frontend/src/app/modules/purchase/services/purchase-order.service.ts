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
  IPurchaseOrderItem,
  IPurchaseOrderReceiveRequest
} from '../../../shared/interfaces/purchase.interface';
import { PurchaseOrderApiBody, RawPurchaseOrder } from '../../../shared/interfaces';

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

  buildCreateOrderItems(rawItems: Array<{ productId?: number | null; quantity?: number | null }>): Array<{ productId: number; quantity: number }> {
    return rawItems
      .filter((item) => item?.productId && item?.quantity)
      .map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity)
      }))
      .filter((item) => item.quantity > 0);
  }

  buildReceiveOrderPayload(order: IPurchaseOrder): IPurchaseOrderReceiveRequest {
    const items = (order.items ?? [])
      .map((item) => ({
        productId: item.productId,
        quantity: this.getPendingItemQuantity(item)
      }))
      .filter((item) => item.quantity > 0);

    return { items };
  }

  canReceiveOrder(order: IPurchaseOrder): boolean {
    return (order?.status ?? '').toUpperCase() !== 'RECEIVED' && this.getPendingCount(order) > 0;
  }

  getPendingCount(order: IPurchaseOrder): number {
    return (order.items ?? []).reduce((acc, item) => acc + this.getPendingItemQuantity(item), 0);
  }

  getItemsSummary(order: IPurchaseOrder): string {
    if (!order.items || order.items.length === 0) {
      return 'Sin items';
    }

    return order.items
      .map((item) => {
        const pending = this.getPendingItemQuantity(item);
        return `${item.productName}: ${item.receivedQuantity}/${item.orderedQuantity} (pendiente: ${pending})`;
      })
      .join(' | ');
  }

  private getPendingItemQuantity(item: IPurchaseOrderItem): number {
    const pending = item.pendingQuantity ?? Math.max((item.orderedQuantity ?? 0) - (item.receivedQuantity ?? 0), 0);
    return Math.max(pending, 0);
  }

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
