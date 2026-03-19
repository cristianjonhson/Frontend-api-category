import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ProductCreateDialogComponent } from '../product-add/product-create-dialog.component';
import { ProductEditDialogComponent } from '../product-edit/product-edit-dialog.component';
import { PaginatorService, SweetAlertService } from '../../../../shared/services';
import { CategoryService } from '../../../category/services';
import { SupplierService } from '../../../supplier/services';
import { SharedPaginatorComponent } from '../../../shared/components/paginator/shared-paginator.component';
import { ICategory, IProduct, ISupplier } from '../../../../shared/interfaces';
import { APP_CONFIG } from '../../../../shared/constants/app.constants';
import { DIALOG_CONFIG } from '../../../../shared/constants/dialog.constants';
import { TIMING } from '../../../../shared/constants/ui.constants';
import { CONFIRMATION_MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES, SWEET_ALERT_TEXTS } from '../../../../shared/constants/messages.constants';
import { PAGINATOR_CONFIG } from '../../../../shared/constants/pagination.constants';
import { ProductListFilters } from '../interfaces';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})

export class ProductListComponent implements OnInit, AfterViewInit {
  @ViewChild('sharedPaginator') sharedPaginator!: SharedPaginatorComponent;

  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  dataSource: MatTableDataSource<IProduct>;

  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  supplierControl = new FormControl('');
  categories: string[] = [];
  suppliers: string[] = [];
  realCategories: ICategory[] = [];
  realSuppliers: ISupplier[] = [];
  readonly paginatorConfig = PAGINATOR_CONFIG;

  displayedColumns: string[] = ['name', 'price', 'category', 'supplier', 'quantity', 'actions'];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private dialog: MatDialog,
    private sweetAlert: SweetAlertService,
    private paginatorService: PaginatorService
  ) {
    this.dataSource = this.paginatorService.createDataSource<IProduct>();
  }

  ngOnInit(): void {
    this.restoreFilters();
    this.loadCategories();
    this.loadSuppliers();
    this.loadProducts();

    this.searchControl.valueChanges
      .pipe(debounceTime(TIMING.SEARCH_DEBOUNCE))
      .subscribe(() => {
        this.saveFilters();
        this.applyFilters();
      });
    this.categoryControl.valueChanges.subscribe(() => {
      this.saveFilters();
      this.applyFilters();
    });
    this.supplierControl.valueChanges.subscribe(() => {
      this.saveFilters();
      this.applyFilters();
    });
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data ?? [];
      this.categories = this.productService.buildCategoriesFallback(this.products, this.categories);
      this.suppliers = this.productService.buildSuppliersFallback(this.products, this.suppliers);
      this.applyFilters();
    });
  }

  ngAfterViewInit(): void {
    this.paginatorService.connect(this.dataSource, this.sharedPaginator.paginator);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductCreateDialogComponent, {
      ...DIALOG_CONFIG.PRODUCT_FORM,
      data: {
        categories: this.realCategories,
        suppliers: this.realSuppliers
      }
    });

    dialogRef.afterClosed().subscribe((created) => {
      if (!created) return;

      // Si tu backend devuelve el producto creado, lo agregas y refiltras:
      this.loadProducts();
      this.sweetAlert.showSuccess(SUCCESS_MESSAGES.PRODUCT_CREATED, SWEET_ALERT_TEXTS.TITLE_CREATED);
    });
  }

  openEditDialog(product: IProduct): void {
    const productId = product?.id;
    if (!productId) {
      this.sweetAlert.showError(ERROR_MESSAGES.PRODUCT_UPDATE_ERROR);
      return;
    }

    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      ...DIALOG_CONFIG.PRODUCT_FORM,
      data: {
        product,
        categories: this.realCategories,
        suppliers: this.realSuppliers
      }
    });

    dialogRef.afterClosed().subscribe((updated: IProduct | null) => {
      if (!updated) {
        return;
      }

      this.loadProducts();
      this.sweetAlert.showSuccess(SUCCESS_MESSAGES.PRODUCT_UPDATED, SWEET_ALERT_TEXTS.TITLE_UPDATED);
    });
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
    this.supplierControl.setValue('');
  }

  hasActiveFilters(): boolean {
    const search = (this.searchControl.value ?? '').toString().trim();
    const category = (this.categoryControl.value ?? '').toString().trim();
    const supplier = (this.supplierControl.value ?? '').toString().trim();

    return Boolean(search || category || supplier);
  }

  private restoreFilters(): void {
    try {
      const rawFilters = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.PRODUCT_LIST_FILTERS);
      const filters = rawFilters ? JSON.parse(rawFilters) as Partial<ProductListFilters> : null;

      this.searchControl.setValue(filters?.search ?? '', { emitEvent: false });
      this.categoryControl.setValue(filters?.category ?? '', { emitEvent: false });
      this.supplierControl.setValue(filters?.supplier ?? '', { emitEvent: false });
    } catch {
      this.searchControl.setValue('', { emitEvent: false });
      this.categoryControl.setValue('', { emitEvent: false });
      this.supplierControl.setValue('', { emitEvent: false });
    }
  }

  private saveFilters(): void {
    const filters: ProductListFilters = {
      search: (this.searchControl.value ?? '').toString(),
      category: (this.categoryControl.value ?? '').toString(),
      supplier: (this.supplierControl.value ?? '').toString()
    };

    if (!filters.search && !filters.category && !filters.supplier) {
      localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.PRODUCT_LIST_FILTERS);
      return;
    }

    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.PRODUCT_LIST_FILTERS, JSON.stringify(filters));
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.realCategories = categories ?? [];
      this.categories = this.realCategories
        .map(category => (category?.name ?? '').toString().trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

      if (this.categories.length === 0) {
        this.categories = this.productService.buildCategoriesFallback(this.products, this.categories);
      }
    });
  }

  private loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe((suppliers) => {
      this.realSuppliers = suppliers ?? [];
      this.suppliers = this.realSuppliers
        .map((supplier) => (supplier?.name ?? '').toString().trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

      if (this.suppliers.length === 0) {
        this.suppliers = this.productService.buildSuppliersFallback(this.products, this.suppliers);
      }
    });
  }

  private applyFilters(): void {
    const term = (this.searchControl.value ?? '').toString();
    const selectedCategory = (this.categoryControl.value ?? '').toString().trim();
    const selectedSupplier = (this.supplierControl.value ?? '').toString().trim();

    this.filteredProducts = this.productService.filterProducts(
      this.products,
      term,
      selectedCategory,
      selectedSupplier
    );

    this.paginatorService.setData(this.dataSource, this.filteredProducts, this.sharedPaginator?.paginator);
    this.paginatorService.resetToFirstPage(this.sharedPaginator?.paginator, this.dataSource);
  }

  onDeleteProduct(product: IProduct): void {
    this.sweetAlert.confirmDelete(CONFIRMATION_MESSAGES.DELETE_PRODUCT(product?.name ?? ''))
      .then((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.sweetAlert.showDeleting('producto');

      if (!product.id) {
        this.sweetAlert.showError(ERROR_MESSAGES.PRODUCT_DELETE_ERROR);
        return;
      }

      this.productService.deleteProduct(product.id)
        .subscribe({
          next: () => {
            this.loadProducts();

            this.sweetAlert.showSuccess(SUCCESS_MESSAGES.PRODUCT_DELETED);
          },
          error: (error) => {
            const message = error?.message || ERROR_MESSAGES.PRODUCT_DELETE_ERROR;
            this.sweetAlert.showError(message);
          }
        });
    });
  }

  onPageChange(event: PageEvent): void {
    this.paginatorService.handlePageChange(event, this.dataSource, this.sharedPaginator?.paginator);
  }
}
