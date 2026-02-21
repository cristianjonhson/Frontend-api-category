import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { CategoryComponent } from './category.component';
import { CategoryService } from '../../../shared/services/category.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PaginatorService, SweetAlertService } from '../../../../shared/services';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;

  const categoryServiceMock = {
    getCategories: jasmine.createSpy('getCategories').and.returnValue(of([]))
  };

  const loggerMock = {
    info: jasmine.createSpy('info'),
    error: jasmine.createSpy('error')
  };

  const notificationMock = {
    info: jasmine.createSpy('info'),
    error: jasmine.createSpy('error')
  };

  const sweetAlertMock = {
    confirmDelete: jasmine.createSpy('confirmDelete').and.returnValue(Promise.resolve(false)),
    showDeleting: jasmine.createSpy('showDeleting'),
    showSuccess: jasmine.createSpy('showSuccess'),
    showError: jasmine.createSpy('showError')
  };

  const paginatorServiceMock = {
    createDataSource: jasmine.createSpy('createDataSource').and.returnValue({}),
    connect: jasmine.createSpy('connect'),
    setData: jasmine.createSpy('setData'),
    applyFilter: jasmine.createSpy('applyFilter'),
    handlePageChange: jasmine.createSpy('handlePageChange')
  };

  const dialogMock = {
    open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of(null) })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryComponent ],
      providers: [
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: LoggerService, useValue: loggerMock },
        { provide: NotificationService, useValue: notificationMock },
        { provide: SweetAlertService, useValue: sweetAlertMock },
        { provide: PaginatorService, useValue: paginatorServiceMock },
        { provide: MatDialog, useValue: dialogMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate onPageChange to paginator service', () => {
    const pageEvent = {
      pageIndex: 1,
      pageSize: 10,
      length: 50,
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
