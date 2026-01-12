import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {
  categoryForm: FormGroup;

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
    if (this.categoryForm.valid) {
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.notification.success('Categoría creada exitosamente');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.notification.error('Error al crear la categoría');
          console.error(err);
        }
      });
    }
  }

  /**
   * Cierra el diálogo sin realizar ninguna acción
   */
  cancel(): void {
    this.dialogRef.close(false);
  }
}
