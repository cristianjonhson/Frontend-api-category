import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { EditCategoryComponent } from '../edit-category/edit-category.component';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { LoggerService } from 'src/app/core/services/logger.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { BaseComponent } from 'src/app/shared/components/base.component';
import { PaginatorService, SweetAlertService } from 'src/app/shared/services';
import { TIMING } from 'src/app/shared/constants/ui.constants';
import { DIALOG_CONFIG } from 'src/app/shared/constants/dialog.constants';
import { PAGINATOR_CONFIG } from 'src/app/shared/constants/pagination.constants';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, INFO_MESSAGES, CONFIRMATION_MESSAGES, SWEET_ALERT_TEXTS } from 'src/app/shared/constants/messages.constants';

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
export class CategoryComponent extends BaseComponent implements OnInit, AfterViewInit {

  // ViewChild para el paginador
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Arreglo de nombres de columnas para la tabla
  displayedColumns: string[] = ['name', 'description', 'actions'];

  // Fuente de datos para la tabla
  dataSource: MatTableDataSource<ICategory>;

  // Control para el buscador
  searchControl = new FormControl('');

  // Configuración del paginador (expuesta para el template)
  readonly paginatorConfig = PAGINATOR_CONFIG;

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
    private notification: NotificationService,
    private sweetAlert: SweetAlertService,
    private paginatorService: PaginatorService
  ) {
    super(); // Llamar al constructor del BaseComponent
    this.dataSource = this.paginatorService.createDataSource<ICategory>();
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: ICategory, filter: string) => {
      const term = (filter ?? '').toString().toLowerCase().trim();
      if (!term) {
        return true;
      }

      const name = (data?.name ?? '').toString().toLowerCase();
      const description = (data?.description ?? '').toString().toLowerCase();

      return name.includes(term) || description.includes(term);
    };

    this.getCategories();

    this.searchControl.valueChanges
      .pipe(debounceTime(TIMING.SEARCH_DEBOUNCE), takeUntil(this.destroy$))
      .subscribe(() => this.applyFilter());
  }

  /**
   * Hook del ciclo de vida que se ejecuta después de inicializar la vista
   * Conecta el paginador al dataSource
   */
  ngAfterViewInit(): void {
    this.paginatorService.connect(this.dataSource, this.paginator);
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
          this.paginatorService.setData(this.dataSource, categories, this.paginator);
          this.applyFilter();

          if (categories.length === 0) {
            this.notification.info(INFO_MESSAGES.NO_CATEGORIES);
          }
        },
        error: (error) => {
          this.logger.error('Error al obtener categorías:', error);
          this.notification.error(error.message || ERROR_MESSAGES.CATEGORY_LOAD_ERROR);
        }
      });
  }

  /**
   * Aplica el filtro de búsqueda a la tabla
   */
  applyFilter(): void {
    const term = (this.searchControl.value ?? '').toString().toLowerCase().trim();
    this.paginatorService.applyFilter(this.dataSource, term, this.paginator);
  }



  /**
   * Abre el diálogo para agregar una nueva categoría
   */
  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryComponent, DIALOG_CONFIG.FORM);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.logger.info('Nueva categoría agregada, recargando lista');
          this.sweetAlert.showSuccess(SUCCESS_MESSAGES.CATEGORY_CREATED, SWEET_ALERT_TEXTS.TITLE_CREATED);
          this.getCategories();
        }
      });
  }

  /**
   * Abre el diálogo para editar una categoría
   */
  openEditCategoryDialog(category: ICategory): void {
    const dialogRef = this.dialog.open(EditCategoryComponent, {
      ...DIALOG_CONFIG.FORM,
      data: { category }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          this.logger.info('Categoría actualizada, recargando lista');
          this.sweetAlert.showSuccess(SUCCESS_MESSAGES.CATEGORY_UPDATED, SWEET_ALERT_TEXTS.TITLE_UPDATED);
          this.getCategories();
        }
      });
  }

  /**
   * Elimina una categoría seleccionada
   * @param category Categoría a eliminar
   */
  onDeleteCategory(category: ICategory): void {
    this.sweetAlert.confirmDelete(CONFIRMATION_MESSAGES.DELETE_CATEGORY(category.name))
      .then((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.sweetAlert.showDeleting('categoria');

      this.categoryService.deleteCategory(category.id!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.getCategories();
            this.sweetAlert.showSuccess(SUCCESS_MESSAGES.CATEGORY_DELETED);
          },
          error: (error) => {
            const message = error.message || ERROR_MESSAGES.CATEGORY_DELETE_ERROR;
            this.logger.error('Error al eliminar categoria:', error);
            this.sweetAlert.showError(message);
          }
        });
    });
  }

  /**
   * Actualiza la lista de categorías después de agregar una nueva
   */
  refreshCategories(): void {
    this.getCategories();
  }
}
