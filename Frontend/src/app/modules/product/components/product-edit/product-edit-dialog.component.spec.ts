import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ProductEditDialogComponent } from './product-edit-dialog.component';
import { ProductService } from '../../services';
import { SweetAlertService } from '../../../../shared/services';

describe('ProductEditDialogComponent', () => {
  let component: ProductEditDialogComponent;
  let fixture: ComponentFixture<ProductEditDialogComponent>;

  const productServiceMock = {
    updateProduct: jasmine.createSpy('updateProduct').and.returnValue(of(null))
  };

  const sweetAlertMock = {
    showError: jasmine.createSpy('showError')
  };

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductEditDialogComponent],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceMock },
        { provide: SweetAlertService, useValue: sweetAlertMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            product: { id: 1, name: 'Prod', price: 10, quantity: 1, categoryId: 1, categoryName: 'Cat' },
            categories: [{ id: 1, name: 'Cat', description: 'Desc' }],
            suppliers: []
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
