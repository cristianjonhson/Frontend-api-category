export interface IPurchaseOrderItem {
  id?: number;
  productId: number;
  productName?: string;
  orderedQuantity: number;
  receivedQuantity: number;
  pendingQuantity?: number;
}

export interface IPurchaseOrder {
  id?: number;
  orderNumber: string;
  supplierId: number;
  supplierName?: string;
  status: string;
  expectedDate?: string;
  createdAt?: string;
  receivedAt?: string;
  items: IPurchaseOrderItem[];
}

export interface IPurchaseOrderItemCreateRequest {
  productId: number;
  quantity: number;
}

export interface IPurchaseOrderCreateRequest {
  supplierId: number;
  expectedDate?: string;
  items: IPurchaseOrderItemCreateRequest[];
}

export interface IPurchaseOrderReceiveItemRequest {
  productId: number;
  quantity: number;
}

export interface IPurchaseOrderReceiveRequest {
  items: IPurchaseOrderReceiveItemRequest[];
}
