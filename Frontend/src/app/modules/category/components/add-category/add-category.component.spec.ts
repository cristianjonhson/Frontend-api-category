import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { AddCategoryComponent } from './add-category.component';
import { CategoryService } from '../../services';
import { LoggerService } from '../../../../core/services/logger.service';
import { NotificationService } from '../../../../core/services/notification.service';

describe('AddCategoryComponent', () => {
  let component: AddCategoryComponent;
  let fixture: ComponentFixture<AddCategoryComponent>;

  const categoryServiceMock = {
    createCategory: jasmine.createSpy('createCategory').and.returnValue(of({}))
  };

  const notificationMock = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error')
  };

  const loggerMock = {
    error: jasmine.createSpy('error')
  };

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCategoryComponent],
      providers: [
        FormBuilder,
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: LoggerService, useValue: loggerMock },
        { provide: NotificationService, useValue: notificationMock },
        { provide: MatDialogRef, useValue: dialogRefMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AddCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
