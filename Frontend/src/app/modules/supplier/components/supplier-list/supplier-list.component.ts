import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { LoggerService } from '../../../../core/services/logger.service';

import { PaginatorService } from '../../../../shared/services';
import { PAGINATOR_CONFIG } from '../../../../shared/constants/pagination.constants';
import { SharedPaginatorComponent } from '../../../shared/components/paginator/shared-paginator.component';
import { ISupplier } from '../../../../shared/interfaces/supplier.interface';
import { SupplierService } from '../../services';
import { SupplierCreateDialogComponent } from '../supplier-add/supplier-create-dialog.component';
import { SupplierEditDialogComponent } from '../supplier-edit/supplier-edit-dialog.component';
import { DIALOG_CONFIG } from '../../../../shared/constants/dialog.constants';
import { CONFIRMATION_MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES, SWEET_ALERT_TEXTS } from '../../../../shared/constants/messages.constants';
import { SweetAlertService } from '../../../../shared/services';
import { APP_CONFIG } from '../../../../shared/constants/app.constants';
import { TIMING } from '../../../../shared/constants/ui.constants';
import { ISupplierRow, SupplierListFilters } from '../interfaces';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit, AfterViewInit {
  private readonly logCtx = '[Supplier][SupplierListComponent]';

  @ViewChild('sharedPaginator') sharedPaginator?: SharedPaginatorComponent;

  readonly displayedColumns: string[] = ['name', 'email', 'phone', 'productsCount', 'productsLabel', 'actions'];
  readonly dataSource: MatTableDataSource<ISupplierRow>;
  readonly paginatorConfig = PAGINATOR_CONFIG;

  searchControl = new FormControl('');
  loading = false;

  constructor(
    private supplierService: SupplierService,
    private logger: LoggerService,
    private paginatorService: PaginatorService,
    private dialog: MatDialog,
    private sweetAlert: SweetAlertService
  ) {
    this.dataSource = this.paginatorService.createDataSource<ISupplierRow>();
  }

  ngOnInit(): void {
    this.restoreSearchFilter();

    this.dataSource.filterPredicate = (data: ISupplierRow, filter: string) => {
      const term = (filter ?? '').toString().toLowerCase().trim();
      if (!term) {
        return true;
      }

      const supplierName = (data?.name ?? '').toString().toLowerCase();
      const email = (data?.email ?? '').toString().toLowerCase();
      const phone = (data?.phone ?? '').toString().toLowerCase();
      const productsLabel = (data?.productsLabel ?? '').toString().toLowerCase();

      return supplierName.includes(term)
        || email.includes(term)
        || phone.includes(term)
        || productsLabel.includes(term);
    };

    this.loadSuppliers();

    this.searchControl.valueChanges
      .pipe(debounceTime(TIMING.SEARCH_DEBOUNCE))
      .subscribe(() => {
        this.saveSearchFilter();
        this.applyFilter();
      });
  }

  ngAfterViewInit(): void {
    this.syncPaginator();
  }

  onPageChange(event: PageEvent): void {
    this.paginatorService.handlePageChange(event, this.dataSource, this.sharedPaginator?.paginator);
  }

  clearFilters(): void {
    this.searchControl.setValue('');
  }

  hasActiveFilters(): boolean {
    return (this.searchControl.value ?? '').toString().trim().length > 0;
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(SupplierCreateDialogComponent, DIALOG_CONFIG.SUPPLIER_FORM);

    dialogRef.afterClosed().subscribe((created) => {
      if (!created) {
        return;
      }

      this.logger.info(`${this.logCtx} Proveedor creado, recargando lista`);
      this.loadSuppliers();
      this.sweetAlert.showSuccess(SUCCESS_MESSAGES.SUPPLIER_CREATED, SWEET_ALERT_TEXTS.TITLE_CREATED);
    });
  }

  openEditDialog(row: ISupplierRow): void {
    const dialogRef = this.dialog.open(SupplierEditDialogComponent, {
      ...DIALOG_CONFIG.SUPPLIER_FORM,
      data: {
        supplier: {
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          products: row.products ?? []
        }
      }
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (!updated) {
        return;
      }

      this.logger.info(`${this.logCtx} Proveedor actualizado, recargando lista`);
      this.loadSuppliers();
      this.sweetAlert.showSuccess(SUCCESS_MESSAGES.SUPPLIER_UPDATED, SWEET_ALERT_TEXTS.TITLE_UPDATED);
    });
  }

  onDeleteSupplier(row: ISupplierRow): void {
    this.sweetAlert.confirmDelete(CONFIRMATION_MESSAGES.DELETE_SUPPLIER(row.name))
      .then((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.sweetAlert.showDeleting('proveedor');

        if (!row.id) {
          this.sweetAlert.showError(ERROR_MESSAGES.SUPPLIER_DELETE_ERROR);
          return;
        }

        this.supplierService.deleteSupplier(row.id)
          .subscribe({
            next: () => {
              this.loadSuppliers();
              this.sweetAlert.showSuccess(SUCCESS_MESSAGES.SUPPLIER_DELETED);
            },
            error: (error) => {
              const message = error?.message || ERROR_MESSAGES.SUPPLIER_DELETE_ERROR;
              this.logger.error(`${this.logCtx} Error al eliminar proveedor`, error);
              this.sweetAlert.showError(message);
            }
          });
      });
  }

  private loadSuppliers(): void {
    this.loading = true;

    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        const rows = this.mapSuppliersToRows(suppliers ?? []);
        this.logger.info(`${this.logCtx} Proveedores cargados:`, rows.length);
        this.syncPaginator();
        this.paginatorService.setData(this.dataSource, rows, this.sharedPaginator?.paginator);
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        this.logger.error(`${this.logCtx} Error al cargar proveedores`, error);
        this.syncPaginator();
        this.paginatorService.setData(this.dataSource, [], this.sharedPaginator?.paginator);
        this.applyFilter();
        this.loading = false;
      }
    });
  }

  private applyFilter(): void {
    const term = (this.searchControl.value ?? '').toString().toLowerCase().trim();
    this.paginatorService.applyFilter(this.dataSource, term, this.sharedPaginator?.paginator);
  }

  private restoreSearchFilter(): void {
    try {
      const rawFilters = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.SUPPLIER_LIST_FILTERS);
      const filters = rawFilters ? JSON.parse(rawFilters) as Partial<SupplierListFilters> : null;
      this.searchControl.setValue(filters?.search ?? '', { emitEvent: false });
    } catch {
      this.searchControl.setValue('', { emitEvent: false });
    }
  }

  private saveSearchFilter(): void {
    const search = (this.searchControl.value ?? '').toString();

    if (!search) {
      localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.SUPPLIER_LIST_FILTERS);
      return;
    }

    localStorage.setItem(
      APP_CONFIG.STORAGE_KEYS.SUPPLIER_LIST_FILTERS,
      JSON.stringify({ search })
    );
  }

  private mapSuppliersToRows(suppliers: ISupplier[]): ISupplierRow[] {
    return suppliers.map((supplier) => {
      const products = supplier.products ?? [];
      const productsLabel = products.length > 0
        ? products.map((product) => product.name).join(', ')
        : 'Sin productos asignados';

      return {
        id: supplier.id,
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        productsCount: products.length,
        productsLabel,
        products
      };
    });
  }

  private syncPaginator(): void {
    if (this.sharedPaginator?.paginator) {
      this.paginatorService.connect(this.dataSource, this.sharedPaginator.paginator);
    }
  }
}
