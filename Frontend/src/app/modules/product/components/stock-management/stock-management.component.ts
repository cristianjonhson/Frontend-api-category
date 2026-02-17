import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { ProductService } from '../../services/product.service';
import { IProduct } from '../../../../shared/interfaces';

interface IStockRow {
  productName: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  availableStock: number;
}

@Component({
  selector: 'app-stock-management',
  templateUrl: './stock-management.component.html',
  styleUrls: ['./stock-management.component.css']
})
export class StockManagementComponent implements OnInit {
  readonly displayedColumns: string[] = ['productName', 'currentStock', 'minStock', 'maxStock', 'availableStock'];
  readonly dataSource = new MatTableDataSource<IStockRow>([]);

  readonly defaultMinStock = 10;
  readonly defaultMaxStock = 100;

  loading = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadStock();
  }

  private loadStock(): void {
    this.loading = true;

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.dataSource.data = this.mapProductsToStockRows(products ?? []);
        this.loading = false;
      },
      error: () => {
        this.dataSource.data = [];
        this.loading = false;
      }
    });
  }

  private mapProductsToStockRows(products: IProduct[]): IStockRow[] {
    return products.map((product) => {
      const currentStock = Number(product?.quantity ?? 0);
      const availableStock = Math.max(currentStock - this.defaultMinStock, 0);

      return {
        productName: (product?.name ?? '').toString(),
        currentStock,
        minStock: this.defaultMinStock,
        maxStock: this.defaultMaxStock,
        availableStock
      };
    });
  }
}
