import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProductCreateDialogComponent } from '../product-add/product-create-dialog.component';
import { ProductEditDialogComponent } from '../product-edit/product-edit-dialog.component';
import { PaginatorService, SweetAlertService } from 'src/app/shared/services';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { ICategory, IProduct } from 'src/app/shared/interfaces';
import { DIALOG_CONFIG } from 'src/app/shared/constants/dialog.constants';
import { TIMING } from 'src/app/shared/constants/ui.constants';
import { CONFIRMATION_MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES, SWEET_ALERT_TEXTS } from 'src/app/shared/constants/messages.constants';
import { PAGINATOR_CONFIG } from 'src/app/shared/constants/pagination.constants';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})

export class ProductListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  dataSource: MatTableDataSource<IProduct>;

  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  categories: string[] = [];
  realCategories: ICategory[] = [];
  readonly paginatorConfig = PAGINATOR_CONFIG;

  displayedColumns: string[] = ['name', 'price', 'category', 'quantity', 'actions'];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private sweetAlert: SweetAlertService,
    private paginatorService: PaginatorService
  ) {
    this.dataSource = this.paginatorService.createDataSource<IProduct>();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();

    this.searchControl.valueChanges
      .pipe(debounceTime(TIMING.SEARCH_DEBOUNCE))
      .subscribe(() => this.applyFilters());
    this.categoryControl.valueChanges.subscribe(() => this.applyFilters());
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data ?? [];
      this.buildCategoriesFallback();
      this.applyFilters();
    });
  }

  ngAfterViewInit(): void {
    this.paginatorService.connect(this.dataSource, this.paginator);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductCreateDialogComponent, {
      ...DIALOG_CONFIG.PRODUCT_FORM,
      data: { categories: this.realCategories }
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
        categories: this.realCategories
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

  private applyFilters(): void {
    const term = (this.searchControl.value ?? '').toString().toLowerCase().trim();
    const selectedCategory = (this.categoryControl.value ?? '').toString().trim();

    this.filteredProducts = this.products.filter((p: IProduct) => {
      const name = (p?.name ?? '').toString().toLowerCase();
      const category = this.getCategoryName(p);

      const matchesName = !term || name.includes(term);
      const matchesCategory = !selectedCategory || category === selectedCategory;

      return matchesName && matchesCategory;
    });

    this.paginatorService.setData(this.dataSource, this.filteredProducts, this.paginator);
    this.paginatorService.resetToFirstPage(this.paginator, this.dataSource);
  }

  private getCategoryName(product: IProduct): string {
    if (typeof product?.category === 'string') {
      return product.category.trim();
    }

    return (product?.categoryName ?? product?.category?.name ?? '').toString().trim();
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
}
