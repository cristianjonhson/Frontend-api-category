export interface RawPurchaseOrderItem {
  id?: number;
  productId?: number;
  productName?: string;
  orderedQuantity?: number;
  receivedQuantity?: number;
  pendingQuantity?: number;
}

export interface RawPurchaseOrder {
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

export interface PurchaseOrderApiBody {
  purchaseOrderResponse?: {
    purchaseOrder?: RawPurchaseOrder[] | RawPurchaseOrder;
  };
}
