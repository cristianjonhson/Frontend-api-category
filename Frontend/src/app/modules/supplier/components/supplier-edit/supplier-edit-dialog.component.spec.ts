import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SupplierEditDialogComponent } from './supplier-edit-dialog.component';
import { SupplierService } from '../../services';
import { SweetAlertService } from '../../../../shared/services';

describe('SupplierEditDialogComponent', () => {
  let component: SupplierEditDialogComponent;
  let fixture: ComponentFixture<SupplierEditDialogComponent>;

  const supplierServiceMock = {
    updateSupplier: jasmine.createSpy('updateSupplier').and.returnValue(of(null))
  };

  const sweetAlertMock = {
    showError: jasmine.createSpy('showError')
  };

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierEditDialogComponent],
      providers: [
        FormBuilder,
        { provide: SupplierService, useValue: supplierServiceMock },
        { provide: SweetAlertService, useValue: sweetAlertMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            supplier: {
              id: 1,
              name: 'Proveedor Demo',
              email: 'demo@test.com',
              phone: '3001234567',
              products: []
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
