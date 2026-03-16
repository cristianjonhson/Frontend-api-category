import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { CategoryService } from '../../services';
import { LoggerService } from '../../../../core/services/logger.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../../shared/constants';
import { EditCategoryDialogData } from '../interfaces';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent {
  categoryForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private logger: LoggerService,
    private notification: NotificationService,
    private dialogRef: MatDialogRef<EditCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditCategoryDialogData
  ) {
    const category = data?.category;

    this.categoryForm = this.fb.group({
      name: [category?.name ?? '', Validators.required],
      description: [category?.description ?? '', Validators.required]
    });
  }

  submit(): void {
    this.errorMessage = '';
    this.categoryForm.markAllAsTouched();

    if (this.categoryForm.invalid || this.loading) {
      return;
    }

    if (!this.data?.category?.id) {
      this.errorMessage = 'No se puede actualizar: falta el id de la categoría';
      this.notification.error(this.errorMessage);
      return;
    }

    this.loading = true;
    this.categoryForm.disable();

    this.categoryService.updateCategory(this.data.category.id, this.categoryForm.value)
      .pipe(finalize(() => {
        this.loading = false;
        this.categoryForm.enable();
      }))
      .subscribe({
        next: () => {
          this.notification.success(SUCCESS_MESSAGES.CATEGORY_UPDATED);
          this.dialogRef.close(true);
        },
        error: (err) => {
          const message = err?.error?.message || err?.message || ERROR_MESSAGES.CATEGORY_UPDATE_ERROR;
          this.errorMessage = message;
          this.notification.error(message);
          this.logger.error('Error al actualizar categoría', err);
        }
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
