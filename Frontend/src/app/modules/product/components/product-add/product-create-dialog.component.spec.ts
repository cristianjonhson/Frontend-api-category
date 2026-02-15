import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ProductCreateDialogComponent } from './product-create-dialog.component';
import { ProductService } from '../../services/product.service';
import { SweetAlertService } from '../../../../shared/services';

describe('ProductCreateDialogComponent', () => {
  let component: ProductCreateDialogComponent;
  let fixture: ComponentFixture<ProductCreateDialogComponent>;

  const productServiceMock = {
    createProduct: jasmine.createSpy('createProduct').and.returnValue(of(null))
  };

  const sweetAlertMock = {
    showError: jasmine.createSpy('showError')
  };

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductCreateDialogComponent],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceMock },
        { provide: SweetAlertService, useValue: sweetAlertMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { categories: [] } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
