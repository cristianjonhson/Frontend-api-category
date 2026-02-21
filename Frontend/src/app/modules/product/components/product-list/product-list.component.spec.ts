import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { PaginatorService, SweetAlertService } from '../../../../shared/services';
import { createPageEvent } from '../../../../../testing/helpers/page-event.helper';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  const productServiceMock = {
    getProducts: jasmine.createSpy('getProducts').and.returnValue(of([])),
    deleteProduct: jasmine.createSpy('deleteProduct').and.returnValue(of(void 0))
  };

  const categoryServiceMock = {
    getCategories: jasmine.createSpy('getCategories').and.returnValue(of([]))
  };

  const dialogMock = {
    open: jasmine.createSpy('open').and.returnValue({
      afterClosed: () => of(null)
    })
  };

  const sweetAlertMock = {
    showSuccess: jasmine.createSpy('showSuccess'),
    showError: jasmine.createSpy('showError'),
    showDeleting: jasmine.createSpy('showDeleting'),
    confirmDelete: jasmine.createSpy('confirmDelete').and.returnValue(Promise.resolve(false))
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
      declarations: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: SweetAlertService, useValue: sweetAlertMock },
        { provide: PaginatorService, useValue: paginatorServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate onPageChange to paginator service', () => {
    const pageEvent = createPageEvent({
      pageIndex: 2,
      pageSize: 25,
      length: 200,
      previousPageIndex: 1
    });
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
