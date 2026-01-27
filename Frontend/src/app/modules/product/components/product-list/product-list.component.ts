import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  displayedColumns: string[] = ['name', 'price', 'category', 'quantity']; // Add 'quantity' column

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data.map(product => ({
        ...product,
        category: product.category || 'Sin categoría',
        quantity: product.quantity || 0
      }));
    });
  }
}
