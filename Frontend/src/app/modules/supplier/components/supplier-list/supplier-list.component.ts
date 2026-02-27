import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { PaginatorService } from '../../../../shared/services';
import { PAGINATOR_CONFIG } from '../../../../shared/constants/pagination.constants';
import { SharedPaginatorComponent } from '../../../shared/components/paginator/shared-paginator.component';
import { ISupplier } from '../../../../shared/interfaces/supplier.interface';
import { SupplierService } from '../../services/supplier.service';
import { SupplierCreateDialogComponent } from '../supplier-add/supplier-create-dialog.component';
import { SupplierEditDialogComponent } from '../supplier-edit/supplier-edit-dialog.component';
import { DIALOG_CONFIG } from '../../../../shared/constants/dialog.constants';
import { CONFIRMATION_MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES, SWEET_ALERT_TEXTS } from '../../../../shared/constants/messages.constants';
import { SweetAlertService } from '../../../../shared/services';

interface ISupplierRow {
  id?: number;
  name: string;
  email: string;
  phone: string;
  productsCount: number;
  productsLabel: string;
  products: ISupplier['products'];
}

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit, AfterViewInit {
  @ViewChild('sharedPaginator') sharedPaginator!: SharedPaginatorComponent;

  readonly displayedColumns: string[] = ['name', 'email', 'phone', 'productsCount', 'productsLabel', 'actions'];
  readonly dataSource: MatTableDataSource<ISupplierRow>;
  readonly paginatorConfig = PAGINATOR_CONFIG;

  loading = false;

  constructor(
    private supplierService: SupplierService,
    private paginatorService: PaginatorService,
    private dialog: MatDialog,
    private sweetAlert: SweetAlertService
  ) {
    this.dataSource = this.paginatorService.createDataSource<ISupplierRow>();
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  ngAfterViewInit(): void {
    this.paginatorService.connect(this.dataSource, this.sharedPaginator.paginator);
  }

  onPageChange(event: PageEvent): void {
    this.paginatorService.handlePageChange(event, this.dataSource, this.sharedPaginator?.paginator);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(SupplierCreateDialogComponent, DIALOG_CONFIG.SUPPLIER_FORM);

    dialogRef.afterClosed().subscribe((created) => {
      if (!created) {
        return;
      }

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
        this.paginatorService.setData(this.dataSource, rows, this.sharedPaginator?.paginator);
        this.paginatorService.resetToFirstPage(this.sharedPaginator?.paginator, this.dataSource);
        this.loading = false;
      },
      error: () => {
        this.paginatorService.setData(this.dataSource, [], this.sharedPaginator?.paginator);
        this.loading = false;
      }
    });
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
}
