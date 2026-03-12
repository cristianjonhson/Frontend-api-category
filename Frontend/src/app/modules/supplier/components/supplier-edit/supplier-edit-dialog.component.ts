import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

import { SupplierService } from '../../services/supplier.service';
import { ERROR_MESSAGES, VALIDATION_RULES } from '../../../../shared/constants';
import { ISupplier, ISupplierRequest } from '../../../../shared/interfaces/supplier.interface';
import { SweetAlertService } from '../../../../shared/services';
import { SupplierEditDialogData } from '../interfaces';

@Component({
  selector: 'app-supplier-edit-dialog',
  templateUrl: './supplier-edit-dialog.component.html',
  styleUrls: ['./supplier-edit-dialog.component.css']
})
export class SupplierEditDialogComponent {
  loading = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(VALIDATION_RULES.SUPPLIER.NAME_MIN_LENGTH)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(VALIDATION_RULES.SUPPLIER.PHONE_MIN_LENGTH)]]
  });

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private sweetAlert: SweetAlertService,
    private dialogRef: MatDialogRef<SupplierEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SupplierEditDialogData
  ) {
    this.patchFormValues();
  }

  close(): void {
    this.dialogRef.close(null);
  }

  submit(): void {
    this.errorMessage = '';
    this.form.markAllAsTouched();

    if (this.form.invalid || this.loading) {
      return;
    }

    const supplierId = this.data?.supplier?.id;
    if (!supplierId) {
      this.errorMessage = ERROR_MESSAGES.SUPPLIER_UPDATE_ERROR;
      return;
    }

    const payload: ISupplierRequest = this.form.getRawValue();

    this.loading = true;
    this.form.disable();

    this.supplierService.updateSupplier(supplierId, payload)
      .pipe(finalize(() => {
        this.loading = false;
        this.form.enable();
      }))
      .subscribe({
        next: (updated) => {
          this.dialogRef.close(updated ?? { id: supplierId, ...payload, products: this.data?.supplier?.products ?? [] });
        },
        error: (err) => {
          const message = err?.error?.message || err?.message || ERROR_MESSAGES.SUPPLIER_UPDATE_ERROR;
          this.errorMessage = message;
          this.sweetAlert.showError(message);
        }
      });
  }

  private patchFormValues(): void {
    const supplier = this.data?.supplier;

    this.form.patchValue({
      name: supplier?.name ?? '',
      email: supplier?.email ?? '',
      phone: supplier?.phone ?? ''
    });
  }
}
