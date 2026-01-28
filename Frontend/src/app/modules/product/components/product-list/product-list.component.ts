import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ProductCreateDialogComponent } from '../product-add/product-create-dialog.component';

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

  displayedColumns: string[] = ['name', 'price', 'category', 'quantity'];

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

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(() => this.applyFilters());
    this.categoryControl.valueChanges.subscribe(() => this.applyFilters());
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductCreateDialogComponent, {
      width: '520px',
      disableClose: false, // si quieres que solo cierre con botón, ponlo en true
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
}
