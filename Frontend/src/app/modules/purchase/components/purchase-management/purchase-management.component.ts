import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { ProductService } from '../../../product/services/product.service';
import { SupplierService } from '../../../supplier/services/supplier.service';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import {
  IPurchaseOrder,
  IPurchaseOrderCreateRequest,
  IPurchaseOrderReceiveRequest,
  IProduct,
  ISupplier
} from '../../../../shared/interfaces';
import { SweetAlertService } from '../../../../shared/services';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../../shared/constants/messages.constants';

@Component({
  selector: 'app-purchase-management',
  templateUrl: './purchase-management.component.html',
  styleUrls: ['./purchase-management.component.css']
})
export class PurchaseManagementComponent implements OnInit {
  suppliers: ISupplier[] = [];
  products: IProduct[] = [];

  loadingOrders = false;
  creatingOrder = false;

  displayedColumns: string[] = ['orderNumber', 'supplier', 'status', 'expectedDate', 'createdAt', 'items', 'actions'];
  dataSource = new MatTableDataSource<IPurchaseOrder>([]);

  form = this.fb.group({
    supplierId: [null as number | null, Validators.required],
    expectedDate: [''],
    items: this.fb.array([])
  });

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private productService: ProductService,
    private purchaseOrderService: PurchaseOrderService,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.addItem();
    this.loadSuppliers();
    this.loadProducts();
    this.loadOrders();
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        productId: [null as number | null, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]]
      })
    );
  }

  removeItem(index: number): void {
    if (this.items.length <= 1) {
      return;
    }

    this.items.removeAt(index);
  }

  createOrder(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.creatingOrder) {
      return;
    }

    const supplierId = this.form.value.supplierId as number;
    const expectedDate = (this.form.value.expectedDate ?? '').toString();
    const rawItems = this.items.controls.map((control) => control.value);

    const items = rawItems
      .filter((item) => item?.productId && item?.quantity)
      .map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity)
      }))
      .filter((item) => item.quantity > 0);

    if (items.length === 0) {
      this.sweetAlert.showError(ERROR_MESSAGES.PURCHASE_ORDER_CREATE_ERROR);
      return;
    }

    const payload: IPurchaseOrderCreateRequest = {
      supplierId,
      expectedDate: expectedDate || undefined,
      items
    };

    this.creatingOrder = true;

    this.purchaseOrderService.createPurchaseOrder(payload).subscribe({
      next: () => {
        this.creatingOrder = false;
        this.resetForm();
        this.loadOrders();
        this.sweetAlert.showSuccess(SUCCESS_MESSAGES.PURCHASE_ORDER_CREATED, 'Creado');
      },
      error: (error) => {
        this.creatingOrder = false;
        const message = error?.error?.message || error?.message || ERROR_MESSAGES.PURCHASE_ORDER_CREATE_ERROR;
        this.sweetAlert.showError(message);
      }
    });
  }

  receiveOrder(order: IPurchaseOrder): void {
    const orderId = order?.id;
    if (!orderId) {
      this.sweetAlert.showError(ERROR_MESSAGES.PURCHASE_ORDER_RECEIVE_ERROR);
      return;
    }

    const receiveItems = (order.items ?? [])
      .map((item) => ({
        productId: item.productId,
        quantity: item.pendingQuantity ?? Math.max((item.orderedQuantity ?? 0) - (item.receivedQuantity ?? 0), 0)
      }))
      .filter((item) => item.quantity > 0);

    if (receiveItems.length === 0) {
      this.sweetAlert.showError('La orden ya no tiene cantidades pendientes por recibir');
      return;
    }

    this.sweetAlert.confirmDelete(`¿Registrar recepción de mercadería para la orden ${order.orderNumber}?`)
      .then((confirmed) => {
        if (!confirmed) {
          return;
        }

        const payload: IPurchaseOrderReceiveRequest = { items: receiveItems };

        this.purchaseOrderService.receivePurchaseOrder(orderId, payload).subscribe({
          next: () => {
            this.loadOrders();
            this.sweetAlert.showSuccess(SUCCESS_MESSAGES.PURCHASE_ORDER_RECEIVED, 'Actualizado');
          },
          error: (error) => {
            const message = error?.error?.message || error?.message || ERROR_MESSAGES.PURCHASE_ORDER_RECEIVE_ERROR;
            this.sweetAlert.showError(message);
          }
        });
      });
  }

  canReceive(order: IPurchaseOrder): boolean {
    return (order?.status ?? '').toUpperCase() !== 'RECEIVED' && this.getPendingCount(order) > 0;
  }

  getPendingCount(order: IPurchaseOrder): number {
    return (order.items ?? []).reduce((acc, item) => {
      const pending = item.pendingQuantity ?? Math.max((item.orderedQuantity ?? 0) - (item.receivedQuantity ?? 0), 0);
      return acc + Math.max(pending, 0);
    }, 0);
  }

  getItemsSummary(order: IPurchaseOrder): string {
    if (!order.items || order.items.length === 0) {
      return 'Sin items';
    }

    return order.items
      .map((item) => {
        const pending = item.pendingQuantity ?? Math.max((item.orderedQuantity ?? 0) - (item.receivedQuantity ?? 0), 0);
        return `${item.productName}: ${item.receivedQuantity}/${item.orderedQuantity} (pendiente: ${pending})`;
      })
      .join(' | ');
  }

  private loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers ?? [];
      },
      error: () => {
        this.suppliers = [];
      }
    });
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products ?? [];
      },
      error: () => {
        this.products = [];
      }
    });
  }

  private loadOrders(): void {
    this.loadingOrders = true;

    this.purchaseOrderService.getPurchaseOrders().subscribe({
      next: (orders) => {
        this.dataSource.data = orders ?? [];
        this.loadingOrders = false;
      },
      error: (error) => {
        this.dataSource.data = [];
        this.loadingOrders = false;

        const message = error?.error?.message || error?.message || ERROR_MESSAGES.PURCHASE_ORDER_LOAD_ERROR;
        this.sweetAlert.showError(message);
      }
    });
  }

  private resetForm(): void {
    this.form.reset({
      supplierId: null,
      expectedDate: ''
    });

    this.items.clear();
    this.addItem();
  }
}
