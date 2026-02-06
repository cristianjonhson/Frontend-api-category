import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ProductCreateDialogComponent } from '../product-add/product-create-dialog.component';
import { DIALOG_CONFIG } from 'src/app/shared/constants/dialog.constants';
import { TIMING } from 'src/app/shared/constants/ui.constants';
import { CONFIRMATION_MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/app/shared/constants/messages.constants';
import Swal from 'sweetalert2';

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
    private dialog: MatDialog
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
    Swal.fire({
      title: 'Confirmar eliminacion',
      text: CONFIRMATION_MESSAGES.DELETE_PRODUCT(product?.name ?? ''),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      focusCancel: true,
      reverseButtons: true
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      Swal.fire({
        title: 'Eliminando producto...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading()
      });

      this.productService.deleteProduct(product.id)
        .subscribe({
          next: () => {
            this.products = this.products.filter(p => p.id !== product.id);
            this.buildCategories();
            this.applyFilters();

            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: SUCCESS_MESSAGES.PRODUCT_DELETED,
              timer: 1800,
              showConfirmButton: false
            });
          },
          error: (error) => {
            const message = error?.message || ERROR_MESSAGES.PRODUCT_DELETE_ERROR;
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: message
            });
          }
        });
    });
  }
}
