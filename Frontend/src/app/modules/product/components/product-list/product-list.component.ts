import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { ProductCreateDialogComponent } from '../product-add/product-create-dialog.component';
import { ProductEditDialogComponent } from '../product-edit/product-edit-dialog.component';
import { PaginatorService, SweetAlertService } from '../../../../shared/services';
import { CategoryService } from '../../../shared/services/category.service';
import { SupplierService } from '../../../supplier/services/supplier.service';
import { SharedPaginatorComponent } from '../../../shared/components/paginator/shared-paginator.component';
import { ICategory, IProduct, ISupplier } from '../../../../shared/interfaces';
import { DIALOG_CONFIG } from '../../../../shared/constants/dialog.constants';
import { TIMING } from '../../../../shared/constants/ui.constants';
import { CONFIRMATION_MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES, SWEET_ALERT_TEXTS } from '../../../../shared/constants/messages.constants';
import { PAGINATOR_CONFIG } from '../../../../shared/constants/pagination.constants';

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
    this.loadCategories();
    this.loadSuppliers();
    this.loadProducts();

    this.searchControl.valueChanges
      .pipe(debounceTime(TIMING.SEARCH_DEBOUNCE))
      .subscribe(() => this.applyFilters());
    this.categoryControl.valueChanges.subscribe(() => this.applyFilters());
    this.supplierControl.valueChanges.subscribe(() => this.applyFilters());
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data ?? [];
      this.buildCategoriesFallback();
      this.buildSuppliersFallback();
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

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.realCategories = categories ?? [];
      this.categories = this.realCategories
        .map(category => (category?.name ?? '').toString().trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));

      if (this.categories.length === 0) {
        this.buildCategoriesFallback();
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
        this.buildSuppliersFallback();
      }
    });
  }

  private buildCategoriesFallback(): void {
    const derivedCategories = Array.from(
      new Set(
        this.products
          .map((product: IProduct) => this.getCategoryName(product))
          .filter(Boolean)
      )
    ).sort();

    if (this.categories.length === 0) {
      this.categories = derivedCategories;
      return;
    }

    this.categories = Array.from(new Set([...this.categories, ...derivedCategories]))
      .sort((a, b) => a.localeCompare(b));
  }

  private buildSuppliersFallback(): void {
    const derivedSuppliers = Array.from(
      new Set(
        this.products
          .map((product: IProduct) => this.getSupplierName(product))
          .filter(Boolean)
      )
    ).sort();

    if (this.suppliers.length === 0) {
      this.suppliers = derivedSuppliers;
      return;
    }

    this.suppliers = Array.from(new Set([...this.suppliers, ...derivedSuppliers]))
      .sort((a, b) => a.localeCompare(b));
  }

  private applyFilters(): void {
    const term = (this.searchControl.value ?? '').toString().toLowerCase().trim();
    const selectedCategory = (this.categoryControl.value ?? '').toString().trim();
    const selectedSupplier = (this.supplierControl.value ?? '').toString().trim();

    this.filteredProducts = this.products.filter((p: IProduct) => {
      const name = (p?.name ?? '').toString().toLowerCase();
      const category = this.getCategoryName(p);
      const supplier = this.getSupplierName(p);

      const matchesName = !term || name.includes(term);
      const matchesCategory = !selectedCategory || category === selectedCategory;
      const matchesSupplier = !selectedSupplier || supplier === selectedSupplier;

      return matchesName && matchesCategory && matchesSupplier;
    });

    this.paginatorService.setData(this.dataSource, this.filteredProducts, this.sharedPaginator?.paginator);
    this.paginatorService.resetToFirstPage(this.sharedPaginator?.paginator, this.dataSource);
  }

  private getCategoryName(product: IProduct): string {
    if (typeof product?.category === 'string') {
      return product.category.trim();
    }

    return (product?.categoryName ?? product?.category?.name ?? '').toString().trim();
  }

  private getSupplierName(product: IProduct): string {
    return (product?.supplierName ?? '').toString().trim();
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
