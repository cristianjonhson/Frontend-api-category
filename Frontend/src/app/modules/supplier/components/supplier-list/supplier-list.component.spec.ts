import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SupplierListComponent } from './supplier-list.component';
import { SupplierService } from '../../services';
import { PaginatorService, SweetAlertService } from '../../../../shared/services';
import { createPageEvent } from '../../../../../testing/helpers/page-event.helper';
import { MatDialog } from '@angular/material/dialog';
import { APP_CONFIG } from '../../../../shared/constants/app.constants';
import { TIMING } from '../../../../shared/constants/ui.constants';

describe('SupplierListComponent', () => {
  let component: SupplierListComponent;
  let fixture: ComponentFixture<SupplierListComponent>;

  const supplierServiceMock = {
    getSuppliers: jasmine.createSpy('getSuppliers').and.returnValue(of([])),
    deleteSupplier: jasmine.createSpy('deleteSupplier').and.returnValue(of(void 0))
  };

  const paginatorServiceMock = {
    createDataSource: jasmine.createSpy('createDataSource').and.callFake(() => ({ data: [] })),
    connect: jasmine.createSpy('connect'),
    setData: jasmine.createSpy('setData'),
    resetToFirstPage: jasmine.createSpy('resetToFirstPage'),
    applyFilter: jasmine.createSpy('applyFilter'),
    handlePageChange: jasmine.createSpy('handlePageChange')
  };

  const dialogMock = {
    open: jasmine.createSpy('open').and.returnValue({
      afterClosed: () => of(null)
    })
  };

  const sweetAlertMock = {
    showSuccess: jasmine.createSpy('showSuccess'),
    confirmDelete: jasmine.createSpy('confirmDelete'),
    showDeleting: jasmine.createSpy('showDeleting'),
    showError: jasmine.createSpy('showError')
  };

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      declarations: [SupplierListComponent],
      providers: [
        { provide: SupplierService, useValue: supplierServiceMock },
        { provide: PaginatorService, useValue: paginatorServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: SweetAlertService, useValue: sweetAlertMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate onPageChange to paginator service', () => {
    const pageEvent = createPageEvent({ pageIndex: 1, pageSize: 10, length: 40, previousPageIndex: 0 });
    const paginatorRef = {} as any;

    (component as any).sharedPaginator = { paginator: paginatorRef } as any;

    component.onPageChange(pageEvent);

    expect(paginatorServiceMock.handlePageChange).toHaveBeenCalledWith(
      pageEvent,
      component.dataSource,
      paginatorRef
    );
  });

  it('should open edit dialog', () => {
    const row = {
      id: 1,
      name: 'Proveedor 1',
      email: 'p1@test.com',
      phone: '3001234567',
      productsCount: 0,
      productsLabel: 'Sin productos asignados',
      products: []
    };

    component.openEditDialog(row);

    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should delete supplier after confirmation', async () => {
    sweetAlertMock.confirmDelete.and.callFake(() => Promise.resolve(true));
    const row = {
      id: 1,
      name: 'Proveedor 1',
      email: 'p1@test.com',
      phone: '3001234567',
      productsCount: 0,
      productsLabel: 'Sin productos asignados',
      products: []
    };

    component.onDeleteSupplier(row);
    await sweetAlertMock.confirmDelete.calls.mostRecent().returnValue;
    await fixture.whenStable();

    expect(sweetAlertMock.confirmDelete).toHaveBeenCalled();
    expect(sweetAlertMock.showDeleting).toHaveBeenCalledWith('proveedor');
    expect(supplierServiceMock.deleteSupplier).toHaveBeenCalledWith(1);
  });

  it('should not delete supplier when confirmation is cancelled', async () => {
    sweetAlertMock.showDeleting.calls.reset();
    supplierServiceMock.deleteSupplier.calls.reset();
    sweetAlertMock.confirmDelete.and.callFake(() => Promise.resolve(false));

    const row = {
      id: 1,
      name: 'Proveedor 1',
      email: 'p1@test.com',
      phone: '3001234567',
      productsCount: 0,
      productsLabel: 'Sin productos asignados',
      products: []
    };

    component.onDeleteSupplier(row);
    await sweetAlertMock.confirmDelete.calls.mostRecent().returnValue;
    await fixture.whenStable();

    expect(sweetAlertMock.confirmDelete).toHaveBeenCalled();
    expect(sweetAlertMock.showDeleting).not.toHaveBeenCalled();
    expect(supplierServiceMock.deleteSupplier).not.toHaveBeenCalled();
  });

  it('should restore persisted search filter on init', () => {
    localStorage.setItem(
      APP_CONFIG.STORAGE_KEYS.SUPPLIER_LIST_FILTERS,
      JSON.stringify({ search: 'acme' })
    );

    const restoredFixture = TestBed.createComponent(SupplierListComponent);
    const restoredComponent = restoredFixture.componentInstance;
    restoredFixture.detectChanges();

    expect(restoredComponent.searchControl.value).toBe('acme');
  });

  it('should remove persisted filter when search is cleared', fakeAsync(() => {
    component.searchControl.setValue('acme');
    tick(TIMING.SEARCH_DEBOUNCE);

    expect(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.SUPPLIER_LIST_FILTERS)).toContain('acme');

    component.searchControl.setValue('');
    tick(TIMING.SEARCH_DEBOUNCE);

    expect(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.SUPPLIER_LIST_FILTERS)).toBeNull();
  }));

  it('should detect active filters', () => {
    component.searchControl.setValue('acme');

    expect(component.hasActiveFilters()).toBeTrue();

    component.searchControl.setValue('   ');

    expect(component.hasActiveFilters()).toBeFalse();
  });
});
