import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

import { SupplierService } from '../../services';
import { ERROR_MESSAGES, VALIDATION_RULES } from '../../../../shared/constants';
import { ISupplierRequest } from '../../../../shared/interfaces/supplier.interface';
import { SweetAlertService } from '../../../../shared/services';

@Component({
  selector: 'app-supplier-create-dialog',
  templateUrl: './supplier-create-dialog.component.html',
  styleUrls: ['./supplier-create-dialog.component.css']
})
export class SupplierCreateDialogComponent {
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
    private dialogRef: MatDialogRef<SupplierCreateDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close(null);
  }

  submit(): void {
    this.errorMessage = '';
    this.form.markAllAsTouched();

    if (this.form.invalid || this.loading) {
      return;
    }

    const payload: ISupplierRequest = this.form.getRawValue();

    this.loading = true;
    this.form.disable();

    this.supplierService.createSupplier(payload)
      .pipe(finalize(() => {
        this.loading = false;
        this.form.enable();
      }))
      .subscribe({
        next: (created) => {
          this.dialogRef.close(created ?? payload);
        },
        error: (err) => {
          const message = err?.error?.message || err?.message || ERROR_MESSAGES.SUPPLIER_CREATE_ERROR;
          this.errorMessage = message;
          this.sweetAlert.showError(message);
        }
      });
  }
}
