import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SupplierListComponent } from './supplier-list.component';
import { SupplierService } from '../../services/supplier.service';
import { PaginatorService } from '../../../../shared/services';
import { createPageEvent } from '../../../../../testing/helpers/page-event.helper';

describe('SupplierListComponent', () => {
  let component: SupplierListComponent;
  let fixture: ComponentFixture<SupplierListComponent>;

  const supplierServiceMock = {
    getSuppliers: jasmine.createSpy('getSuppliers').and.returnValue(of([]))
  };

  const paginatorServiceMock = {
    createDataSource: jasmine.createSpy('createDataSource').and.callFake(() => ({ data: [] })),
    connect: jasmine.createSpy('connect'),
    setData: jasmine.createSpy('setData'),
    resetToFirstPage: jasmine.createSpy('resetToFirstPage'),
    handlePageChange: jasmine.createSpy('handlePageChange')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierListComponent],
      providers: [
        { provide: SupplierService, useValue: supplierServiceMock },
        { provide: PaginatorService, useValue: paginatorServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
});
