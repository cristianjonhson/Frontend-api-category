import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { NewCategoryComponent } from './new-category/new-category.component';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { LoggerService } from 'src/app/core/services/logger.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { BaseComponent } from 'src/app/shared/components/base.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent extends BaseComponent implements OnInit {

  // Arreglo de nombres de columnas para la tabla
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];

  // Fuente de datos para la tabla
  dataSource: MatTableDataSource<ICategory>;

  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private logger: LoggerService,
    private notification: NotificationService
  ) {
    super(); // Llamar al constructor del BaseComponent
  }

  ngOnInit(): void {
    this.getCategories();
  }

  /**
   * Obtiene las categorías del servicio
   * Usa takeUntil para auto-unsubscribe
   */
  getCategories(): void {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.logger.info('Categorías recibidas:', categories.length);
          this.dataSource = new MatTableDataSource<ICategory>(categories);

          if (categories.length === 0) {
            this.notification.info('No se encontraron categorías');
          }
        },
        error: (error) => {
          this.logger.error('Error al obtener categorías:', error);
          this.notification.error(error.message || 'Error al cargar categorías');
        }
      });
  }

  /**
   * Abre el diálogo para crear/editar categoría
   */
  openCategoryDialog(): void {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px'
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.logger.info('Categoría guardada, recargando lista');
          this.notification.success('Categoría guardada exitosamente');
          this.getCategories();
        }
      });
  }
}
