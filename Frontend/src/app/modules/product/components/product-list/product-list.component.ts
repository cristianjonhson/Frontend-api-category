import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProductCreateDialogComponent } from '../product-add/product-create-dialog.component';
import { PaginatorService, SweetAlertService } from 'src/app/shared/services';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { DIALOG_CONFIG } from 'src/app/shared/constants/dialog.constants';
import { TIMING } from 'src/app/shared/constants/ui.constants';
import { CONFIRMATION_MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/app/shared/constants/messages.constants';
import { PAGINATOR_CONFIG } from 'src/app/shared/constants/pagination.constants';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})

export class ProductListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  products: any[] = [];
  filteredProducts: any[] = [];
  dataSource: MatTableDataSource<any>;

  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  categories: string[] = [];
  readonly paginatorConfig = PAGINATOR_CONFIG;

  displayedColumns: string[] = ['name', 'price', 'category', 'quantity', 'actions'];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private sweetAlert: SweetAlertService,
    private paginatorService: PaginatorService
  ) {
    this.dataSource = this.paginatorService.createDataSource<any>();
  }

  ngOnInit(): void {
    this.loadCategories();

    this.productService.getProducts().subscribe((data) => {
      this.products = data ?? [];
      this.buildCategoriesFallback();
      this.applyFilters();
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(TIMING.SEARCH_DEBOUNCE))
      .subscribe(() => this.applyFilters());
    this.categoryControl.valueChanges.subscribe(() => this.applyFilters());
  }

  ngAfterViewInit(): void {
    this.paginatorService.connect(this.dataSource, this.paginator);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductCreateDialogComponent, {
      ...DIALOG_CONFIG.PRODUCT_FORM,
      data: { categories: this.categories }
    });

    dialogRef.afterClosed().subscribe((created) => {
      if (!created) return;

      // Si tu backend devuelve el producto creado, lo agregas y refiltras:
      this.products = [created, ...this.products];
      this.buildCategoriesFallback();
      this.applyFilters();
    });
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = (categories ?? [])
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
          .map(p => (p?.category?.name ?? p?.category ?? '').toString().trim())
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

    this.filteredProducts = this.products.filter(p => {
      const name = (p?.name ?? '').toString().toLowerCase();
      const category = (p?.category?.name ?? p?.category ?? '').toString().trim();

      const matchesName = !term || name.includes(term);
      const matchesCategory = !selectedCategory || category === selectedCategory;

      return matchesName && matchesCategory;
    });

    this.paginatorService.setData(this.dataSource, this.filteredProducts, this.paginator);
    this.paginatorService.resetToFirstPage(this.paginator, this.dataSource);
  }

  onDeleteProduct(product: any): void {
    this.sweetAlert.confirmDelete(CONFIRMATION_MESSAGES.DELETE_PRODUCT(product?.name ?? ''))
      .then((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.sweetAlert.showDeleting('producto');

      this.productService.deleteProduct(product.id)
        .subscribe({
          next: () => {
            this.products = this.products.filter(p => p.id !== product.id);
            this.buildCategoriesFallback();
            this.applyFilters();

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
