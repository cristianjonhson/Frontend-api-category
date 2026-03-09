import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ProductService } from '../../services/product.service';
import { SharedPaginatorComponent } from '../../../shared/components/paginator/shared-paginator.component';
import { PAGINATOR_CONFIG } from '../../../../shared/constants/pagination.constants';
import { IProduct } from '../../../../shared/interfaces';
import { PaginatorService } from '../../../../shared/services';

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
export class StockManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('sharedPaginator') sharedPaginator?: SharedPaginatorComponent;

  readonly displayedColumns: string[] = ['productName', 'currentStock', 'minStock', 'maxStock', 'availableStock'];
  readonly dataSource: MatTableDataSource<IStockRow>;
  readonly paginatorConfig = PAGINATOR_CONFIG;

  readonly defaultMinStock = 10;
  readonly defaultMaxStock = 100;

  loading = false;

  constructor(
    private productService: ProductService,
    private paginatorService: PaginatorService
  ) {
    this.dataSource = this.paginatorService.createDataSource<IStockRow>();
  }

  ngOnInit(): void {
    this.loadStock();
  }

  ngAfterViewInit(): void {
    this.syncPaginator();
  }

  private loadStock(): void {
    this.loading = true;

    this.productService.getProducts().subscribe({
      next: (products) => {
        const stockRows = this.mapProductsToStockRows(products ?? []);
        this.syncPaginator();
        this.paginatorService.setData(this.dataSource, stockRows, this.sharedPaginator?.paginator);
        this.paginatorService.resetToFirstPage(this.sharedPaginator?.paginator, this.dataSource);
        this.loading = false;
      },
      error: () => {
        this.syncPaginator();
        this.paginatorService.setData(this.dataSource, [], this.sharedPaginator?.paginator);
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

  onPageChange(event: PageEvent): void {
    this.paginatorService.handlePageChange(event, this.dataSource, this.sharedPaginator?.paginator);
  }

  private syncPaginator(): void {
    if (this.sharedPaginator?.paginator) {
      this.paginatorService.connect(this.dataSource, this.sharedPaginator.paginator);
    }
  }
}
