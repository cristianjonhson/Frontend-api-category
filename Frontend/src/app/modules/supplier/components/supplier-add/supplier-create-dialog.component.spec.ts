import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { SupplierCreateDialogComponent } from './supplier-create-dialog.component';
import { SupplierService } from '../../services/supplier.service';
import { SweetAlertService } from '../../../../shared/services';

describe('SupplierCreateDialogComponent', () => {
  let component: SupplierCreateDialogComponent;
  let fixture: ComponentFixture<SupplierCreateDialogComponent>;

  const supplierServiceMock = {
    createSupplier: jasmine.createSpy('createSupplier').and.returnValue(of(null))
  };

  const sweetAlertMock = {
    showError: jasmine.createSpy('showError')
  };

  const dialogRefMock = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierCreateDialogComponent],
      providers: [
        FormBuilder,
        { provide: SupplierService, useValue: supplierServiceMock },
        { provide: SweetAlertService, useValue: sweetAlertMock },
        { provide: MatDialogRef, useValue: dialogRefMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
