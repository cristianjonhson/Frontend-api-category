import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ProductCreateDialogComponent } from '../product-add/product-create-dialog.component';
import { SweetAlertService } from 'src/app/shared/services';
import { DIALOG_CONFIG } from 'src/app/shared/constants/dialog.constants';
import { TIMING } from 'src/app/shared/constants/ui.constants';
import { CONFIRMATION_MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/app/shared/constants/messages.constants';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];

  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  categories: string[] = [];

  displayedColumns: string[] = ['name', 'price', 'category', 'quantity', 'actions'];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data ?? [];
      this.buildCategories();
      this.applyFilters();
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(TIMING.SEARCH_DEBOUNCE))
      .subscribe(() => this.applyFilters());
    this.categoryControl.valueChanges.subscribe(() => this.applyFilters());
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
      this.buildCategories();
      this.applyFilters();
    });
  }

  private buildCategories(): void {
    this.categories = Array.from(
      new Set(
        this.products
          .map(p => (p?.category?.name ?? p?.category ?? '').toString().trim())
          .filter(Boolean)
      )
    ).sort();
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
            this.buildCategories();
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
