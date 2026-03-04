import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { API_CONFIG } from '../../../shared/constants';
import { ApiResponse } from '../../../shared/models/api-response.model';
import {
  IPurchaseOrder,
  IPurchaseOrderCreateRequest,
  IPurchaseOrderReceiveRequest
} from '../../../shared/interfaces/purchase.interface';

const baseUrl = environment.base_uri;

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  constructor(private http: HttpClient) {}

  getPurchaseOrders(): Observable<IPurchaseOrder[]> {
    const endpoint = `${baseUrl}${API_CONFIG.ENDPOINTS.PURCHASE_ORDERS}`;

    return this.http.get<ApiResponse<any>>(endpoint).pipe(
      map((response) => this.processGetPurchaseOrdersResponse(response)),
      catchError((err) => throwError(() => err))
    );
  }

  createPurchaseOrder(payload: IPurchaseOrderCreateRequest): Observable<IPurchaseOrder> {
    const endpoint = `${baseUrl}${API_CONFIG.ENDPOINTS.PURCHASE_ORDERS}`;
    const options = {
      headers: {
        [API_CONFIG.HEADERS.SKIP_GLOBAL_ERROR]: 'true'
      }
    };

    return this.http.post<ApiResponse<any>>(endpoint, payload, options).pipe(
      map((response) => this.processSinglePurchaseOrderResponse(response)),
      catchError((err) => throwError(() => err))
    );
  }

  receivePurchaseOrder(id: number, payload: IPurchaseOrderReceiveRequest): Observable<IPurchaseOrder> {
    const endpoint = `${baseUrl}${API_CONFIG.ENDPOINTS.PURCHASE_ORDERS}/${id}/receive`;
    const options = {
      headers: {
        [API_CONFIG.HEADERS.SKIP_GLOBAL_ERROR]: 'true'
      }
    };

    return this.http.post<ApiResponse<any>>(endpoint, payload, options).pipe(
      map((response) => this.processSinglePurchaseOrderResponse(response)),
      catchError((err) => throwError(() => err))
    );
  }

  private processGetPurchaseOrdersResponse(response: ApiResponse<any>): IPurchaseOrder[] {
    const orders = response?.purchaseOrderResponse?.purchaseOrder ?? [];
    return orders.map((order: any) => this.normalizeOrder(order));
  }

  private processSinglePurchaseOrderResponse(response: ApiResponse<any>): IPurchaseOrder {
    const order = response?.purchaseOrderResponse?.purchaseOrder?.[0]
      ?? response?.purchaseOrderResponse?.purchaseOrder
      ?? response?.purchaseOrderResponse;

    return this.normalizeOrder(order);
  }

  private normalizeOrder(order: any): IPurchaseOrder {
    const items = Array.isArray(order?.items) ? order.items : [];

    return {
      id: order?.id,
      orderNumber: order?.orderNumber ?? '',
      supplierId: order?.supplierId,
      supplierName: order?.supplierName ?? '',
      status: order?.status ?? 'PENDING',
      expectedDate: order?.expectedDate,
      createdAt: order?.createdAt,
      receivedAt: order?.receivedAt,
      items: items.map((item: any) => ({
        id: item?.id,
        productId: item?.productId,
        productName: item?.productName ?? '',
        orderedQuantity: item?.orderedQuantity ?? 0,
        receivedQuantity: item?.receivedQuantity ?? 0,
        pendingQuantity: item?.pendingQuantity ?? Math.max((item?.orderedQuantity ?? 0) - (item?.receivedQuantity ?? 0), 0)
      }))
    };
  }
}
