import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {
  categoryForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<AddCategoryComponent>
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  /**
   * Envía el formulario para agregar una nueva categoría
   */
  submit(): void {
    this.errorMessage = '';
    this.categoryForm.markAllAsTouched();

    if (this.categoryForm.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.categoryForm.disable();

    this.categoryService.createCategory(this.categoryForm.value)
      .pipe(finalize(() => {
        this.loading = false;
        this.categoryForm.enable();
      }))
      .subscribe({
        next: () => {
          this.notification.success('Categoría creada exitosamente');
          this.categoryForm.reset();
          this.dialogRef.close(true);
        },
        error: (err) => {
          const message = err?.error?.message || err?.message || 'Error al crear la categoría';
          this.errorMessage = message;
          this.notification.error(message);
          console.error(err);
        }
      });
  }

  /**
   * Cierra el diálogo sin realizar ninguna acción
   */
  cancel(): void {
    this.dialogRef.close(false);
  }
}
