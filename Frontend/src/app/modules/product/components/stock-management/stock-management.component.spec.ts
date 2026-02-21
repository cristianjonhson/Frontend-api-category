import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { StockManagementComponent } from './stock-management.component';
import { ProductService } from '../../services/product.service';
import { PaginatorService } from '../../../../shared/services';

describe('StockManagementComponent', () => {
  let component: StockManagementComponent;
  let fixture: ComponentFixture<StockManagementComponent>;

  const productServiceMock = {
    getProducts: jasmine.createSpy('getProducts').and.returnValue(of([]))
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
      declarations: [StockManagementComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: PaginatorService, useValue: paginatorServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate onPageChange to paginator service', () => {
    const pageEvent = {
      pageIndex: 1,
      pageSize: 20,
      length: 120,
      previousPageIndex: 0
    };
    const paginatorRef = {} as any;

    (component as any).sharedPaginator = { paginator: paginatorRef } as any;

    component.onPageChange(pageEvent as any);

    expect(paginatorServiceMock.handlePageChange).toHaveBeenCalledWith(
      pageEvent as any,
      component.dataSource,
      paginatorRef
    );
  });
});
