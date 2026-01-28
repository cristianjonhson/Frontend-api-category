import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-create-dialog',
  templateUrl: './product-create-dialog.component.html',
  styleUrls: ['./product-create-dialog.component.css']
})
export class ProductCreateDialogComponent {
  loading = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['', [Validators.required]],
    quantity: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: string[] },
    private productService: ProductService
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) return;

    this.loading = true;

    // Ajusta el payload según tu API
    const payload = this.form.getRawValue();

    this.productService.createProduct(payload).subscribe({
      next: (created) => {
        this.loading = false;
        this.dialogRef.close(created); // devuelve el producto creado al listado
      },
      error: () => {
        this.loading = false;
        // aquí podrías mostrar un snackBar si quieres
      }
    });
  }
}
