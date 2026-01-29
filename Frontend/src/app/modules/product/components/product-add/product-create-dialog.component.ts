import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';

export interface ProductCreateDialogData {
  categories: string[];
}

@Component({
  selector: 'app-product-create-dialog',
  templateUrl: './product-create-dialog.component.html',
  styleUrls: ['./product-create-dialog.component.css']
})
export class ProductCreateDialogComponent {
  loading = false;

  // nonNullable evita nulls
  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['', [Validators.required]],
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductCreateDialogData
  ) {}

  close(): void {
    console.log('Dialog: close');
    this.dialogRef.close(null);
  }

  submit(): void {
    console.log('Dialog: submit click');
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      console.log('Dialog: form invalid', this.form.value);
      return;
    }

    const payload = this.form.getRawValue();
    console.log('Dialog: payload', payload);

    this.loading = true;

    this.productService.createProduct(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (created) => {
          console.log('Dialog: created', created);
          this.dialogRef.close(created);
        },
        error: (err) => {
          console.error('Dialog: createProduct error', err);
        }
      });
  }
}
