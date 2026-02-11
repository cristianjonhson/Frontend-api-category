import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { ERROR_MESSAGES, VALIDATION_RULES } from 'src/app/shared/constants';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { IProductRequest } from 'src/app/shared/interfaces/product.interface';
import { SweetAlertService } from 'src/app/shared/services';

export interface ProductCreateDialogData {
  categories: ICategory[];
}

@Component({
  selector: 'app-product-create-dialog',
  templateUrl: './product-create-dialog.component.html',
  styleUrls: ['./product-create-dialog.component.css']
})
export class ProductCreateDialogComponent {
  loading = false;
  errorMessage = '';

  // nonNullable evita nulls
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(VALIDATION_RULES.PRODUCT.NAME_MIN_LENGTH)]],
    price: [0, [Validators.required, Validators.min(VALIDATION_RULES.PRODUCT.PRICE_MIN)]],
    categoryId: [0, [Validators.required, Validators.min(1)]],
    quantity: [0, [Validators.required, Validators.min(VALIDATION_RULES.PRODUCT.QUANTITY_MIN)]],
  });

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private sweetAlert: SweetAlertService,
    private dialogRef: MatDialogRef<ProductCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductCreateDialogData
  ) {}

  close(): void {
    console.log('Dialog: close');
    this.dialogRef.close(null);
  }

  submit(): void {
    this.errorMessage = '';
    this.form.markAllAsTouched();

    if (this.form.invalid || this.loading) {
      return;
    }

    const payload: IProductRequest = this.form.getRawValue();

    this.loading = true;
    this.form.disable();

    this.productService.createProduct(payload)
      .pipe(finalize(() => {
        this.loading = false;
        this.form.enable();
      }))
      .subscribe({
        next: (created) => {
          const result = created ?? payload;
          this.dialogRef.close(result);
        },
        error: (err) => {
          const message = err?.error?.message || err?.message || ERROR_MESSAGES.PRODUCT_CREATE_ERROR;
          this.errorMessage = message;
          this.sweetAlert.showError(message);
        }
      });
  }
}
