import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];

  searchControl = new FormControl('');
  categoryControl = new FormControl(''); // '' = todas

  categories: string[] = [];

  displayedColumns: string[] = ['name', 'price', 'category', 'quantity'];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data ?? [];
      this.filteredProducts = this.products;

      // Si category viene como string: product.category
      // Si viene como objeto: product.category.name
      this.categories = Array.from(
        new Set(
          this.products
            .map(p => (p?.category?.name ?? p?.category ?? '').toString().trim())
            .filter(c => !!c)
        )
      ).sort();

      this.applyFilters();
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => this.applyFilters());

    this.categoryControl.valueChanges
      .subscribe(() => this.applyFilters());
  }

  private applyFilters(): void {
    const term = (this.searchControl.value ?? '').toString().toLowerCase().trim();
    const selectedCategory = (this.categoryControl.value ?? '').toString().trim();

    this.filteredProducts = this.products.filter((p) => {
      const name = (p?.name ?? '').toString().toLowerCase();
      const category = (p?.category?.name ?? p?.category ?? '').toString().trim();

      const matchesName = !term || name.includes(term);
      const matchesCategory = !selectedCategory || category === selectedCategory;

      return matchesName && matchesCategory;
    });
  }
}
