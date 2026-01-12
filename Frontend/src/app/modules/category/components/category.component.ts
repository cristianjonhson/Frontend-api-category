import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { AddCategoryComponent } from './add-category/add-category.component';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { LoggerService } from 'src/app/core/services/logger.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { BaseComponent } from 'src/app/shared/components/base.component';

/**
 * Componente para la gestión de categorías
 *
 * Componente smart que maneja la visualización y gestión de categorías.
 * Extiende BaseComponent para auto-unsubscribe de observables.
 * Utiliza Material Table para mostrar los datos en formato tabular.
 *
 * @component
 * @selector app-category
 * @extends BaseComponent
 */
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

  /**
   * Constructor del componente
   * @param categoryService - Servicio para operaciones CRUD de categorías
   * @param dialog - Servicio de Material Dialog para abrir modales
   * @param logger - Servicio centralizado de logging
   * @param notification - Servicio para mostrar notificaciones al usuario
   */
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
   * Abre el diálogo para agregar una nueva categoría
   */
  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '600px',
      height: '400px'
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.logger.info('Nueva categoría agregada, recargando lista');
          this.notification.success('Categoría agregada exitosamente');
          this.getCategories();
        }
      });
  }

  /**
   * Actualiza la lista de categorías después de agregar una nueva
   */
  refreshCategories(): void {
    this.getCategories();
  }
}
