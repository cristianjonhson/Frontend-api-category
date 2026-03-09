import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { PurchaseManagementComponent } from './purchase-management.component';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { SupplierService } from '../../../supplier/services/supplier.service';
import { ProductService } from '../../../product/services/product.service';
import { PaginatorService, SweetAlertService } from '../../../../shared/services';

describe('PurchaseManagementComponent', () => {
  let component: PurchaseManagementComponent;
  let fixture: ComponentFixture<PurchaseManagementComponent>;

  const purchaseOrderServiceMock = {
    getPurchaseOrders: jasmine.createSpy('getPurchaseOrders').and.returnValue(of([])),
    createPurchaseOrder: jasmine.createSpy('createPurchaseOrder').and.returnValue(of(null)),
    receivePurchaseOrder: jasmine.createSpy('receivePurchaseOrder').and.returnValue(of(null))
  };

  const supplierServiceMock = {
    getSuppliers: jasmine.createSpy('getSuppliers').and.returnValue(of([]))
  };

  const productServiceMock = {
    getProducts: jasmine.createSpy('getProducts').and.returnValue(of([]))
  };

  const sweetAlertMock = {
    confirmDelete: jasmine.createSpy('confirmDelete').and.returnValue(Promise.resolve(false)),
    showSuccess: jasmine.createSpy('showSuccess'),
    showError: jasmine.createSpy('showError')
  };

  const paginatorServiceMock = {
    connect: jasmine.createSpy('connect'),
    setData: jasmine.createSpy('setData'),
    handlePageChange: jasmine.createSpy('handlePageChange')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseManagementComponent],
      providers: [
        { provide: PurchaseOrderService, useValue: purchaseOrderServiceMock },
        { provide: SupplierService, useValue: supplierServiceMock },
        { provide: ProductService, useValue: productServiceMock },
        { provide: PaginatorService, useValue: paginatorServiceMock },
        { provide: SweetAlertService, useValue: sweetAlertMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
