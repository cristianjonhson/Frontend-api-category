import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { ERROR_MESSAGES, VALIDATION_RULES } from 'src/app/shared/constants';
import { ICategory, IProduct, IProductRequest } from 'src/app/shared/interfaces';

export interface ProductEditDialogData {
  product: IProduct;
  categories: ICategory[];
}

@Component({
  selector: 'app-product-edit-dialog',
  templateUrl: './product-edit-dialog.component.html',
  styleUrls: ['./product-edit-dialog.component.css']
})
export class ProductEditDialogComponent {
  loading = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(VALIDATION_RULES.PRODUCT.NAME_MIN_LENGTH)]],
    price: [0, [Validators.required, Validators.min(VALIDATION_RULES.PRODUCT.PRICE_MIN)]],
    categoryId: [0, [Validators.required, Validators.min(1)]],
    quantity: [0, [Validators.required, Validators.min(VALIDATION_RULES.PRODUCT.QUANTITY_MIN)]],
  });

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductEditDialogData
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

    const productId = this.data?.product?.id;
    if (!productId) {
      this.errorMessage = ERROR_MESSAGES.PRODUCT_UPDATE_ERROR;
      return;
    }

    const payload: IProductRequest = this.form.getRawValue();
    this.loading = true;
    this.form.disable();

    this.productService.updateProduct(productId, payload)
      .pipe(finalize(() => {
        this.loading = false;
        this.form.enable();
      }))
      .subscribe({
        next: (updated) => {
          this.dialogRef.close(updated ?? { id: productId, ...payload });
        },
        error: (err) => {
          const message = err?.error?.message || err?.message || ERROR_MESSAGES.PRODUCT_UPDATE_ERROR;
          this.errorMessage = message;
        }
      });
  }

  private patchFormValues(): void {
    const product = this.data?.product;
    const categoryId = this.resolveCategoryId(product, this.data?.categories ?? []);

    this.form.patchValue({
      name: product?.name ?? '',
      price: Number(product?.price ?? 0),
      categoryId,
      quantity: Number(product?.quantity ?? 0)
    });
  }

  private resolveCategoryId(product: IProduct | undefined, categories: ICategory[]): number {
    if (product?.categoryId) {
      return product.categoryId;
    }

    const categoryName = (product?.categoryName ?? '').toString().trim().toLowerCase();
    if (!categoryName) {
      return 0;
    }

    const matchedCategory = categories.find(
      (category) => (category?.name ?? '').toString().trim().toLowerCase() === categoryName
    );

    return matchedCategory?.id ?? 0;
  }
}
