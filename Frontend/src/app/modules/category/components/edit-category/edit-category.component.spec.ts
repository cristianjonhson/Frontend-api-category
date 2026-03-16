import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { EditCategoryComponent } from './edit-category.component';
import { CategoryService } from '../../services';
import { LoggerService } from '../../../../core/services/logger.service';
import { NotificationService } from '../../../../core/services/notification.service';

describe('EditCategoryComponent', () => {
  let component: EditCategoryComponent;
  let fixture: ComponentFixture<EditCategoryComponent>;

  const categoryServiceMock = {
    updateCategory: jasmine.createSpy('updateCategory').and.returnValue(of({}))
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCategoryComponent],
      providers: [
        FormBuilder,
        { provide: CategoryService, useValue: categoryServiceMock },
        { provide: LoggerService, useValue: loggerMock },
        { provide: NotificationService, useValue: notificationMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            category: { id: 1, name: 'Cat', description: 'Desc' }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
