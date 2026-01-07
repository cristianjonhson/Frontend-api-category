import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryComponent } from './new-category/new-category.component';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { CategoryModel } from 'src/app/shared/models/category.model';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { ApiResponseCode } from 'src/app/shared/enums/api-response-code.enum';
import { LoggerService } from 'src/app/core/services/logger.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  // Arreglo de nombres de columnas para la tabla
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];

  // Fuente de datos para la tabla
  dataSource: MatTableDataSource<ICategory>;

  // Propiedad para almacenar el mensaje de error
  errorMessage: string;

  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private logger: LoggerService
  ) { }

  ngOnInit(): void {
    // Llamar al método para obtener las categorías
    this.getCategories();
  }

  /**
   * Obtiene las categorías del servicio
   */
  getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.logger.info('Respuesta de categorías recibida');
        this.processCategoriesResponse(response);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Ocurrió un error al obtener las categorías.';
        this.logger.error('Error al obtener categorías:', error);
      }
    });
  }

  /**
   * Procesa la respuesta de categorías
   * @param response Respuesta de la API
   */
  processCategoriesResponse(response: any): void {
    if (response.metadata && response.metadata[0]?.code === ApiResponseCode.SUCCESS) {
      const categories = response.categoryResponse?.category || [];
      this.dataSource = new MatTableDataSource<ICategory>(categories);
      this.logger.debug('Categorías cargadas:', categories);
    } else {
      this.errorMessage = response.metadata[0]?.message || 'Error al procesar categorías.';
      this.logger.warn('Respuesta no exitosa:', response);
    }
  }

  /**
   * Abre el diálogo para crear/editar categoría
   */
  openCategoryDialog(): void {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logger.info('Diálogo cerrado con resultado:', result);
        // Recargar categorías si se creó/editó una
        this.getCategories();
      }
    });
  }
}
