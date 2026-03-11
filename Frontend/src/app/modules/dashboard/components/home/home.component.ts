import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { CategoryService } from '../../../shared/services/category.service'; // ajusta el path si es distinto
import { APP_CONFIG } from '../../../../shared/constants/app.constants';
import { ROUTE_PATHS } from '../../../../shared/constants/routes.constants';

type ApiStatus = 'LOADING' | 'ONLINE' | 'OFFLINE';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showTips = true;

  categoriesCount: number | null = null;
  lastAction = '—';
  lastUpdated = '—';
  apiStatus: ApiStatus = 'LOADING';

 swaggerUrl = environment.swagger_uri;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.showTips = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.HOME_SHOW_TIPS) ?? 'true');
    this.loadSummary();
  }

  loadSummary(): void {
    this.apiStatus = 'LOADING';

    this.categoryService.getCategories().pipe(take(1)).subscribe({
      next: (categories) => {
        this.categoriesCount = categories.length;
        this.apiStatus = 'ONLINE';
        this.lastUpdated = new Date().toLocaleString();
      },
      error: () => {
        this.categoriesCount = 0;
        this.apiStatus = 'OFFLINE';
        this.lastUpdated = new Date().toLocaleString();
      }
    });
  }

  toggleTips(value: boolean): void {
    this.showTips = value;
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.HOME_SHOW_TIPS, JSON.stringify(value));
  }

  goToCategories(): void {
    this.lastAction = 'Ir a categorías';
    this.router.navigate([ROUTE_PATHS.CATEGORY]);
  }

  goToNewCategory(): void {
    this.lastAction = 'Crear categoría';
    this.router.navigate([ROUTE_PATHS.CATEGORIES_NEW]);
  }

  goToProducts(): void {
    this.lastAction = 'Ir a productos';
    this.router.navigate([ROUTE_PATHS.PRODUCT]);
  }

  goToSuppliers(): void {
    this.lastAction = 'Ir a proveedores';
    this.router.navigate([ROUTE_PATHS.SUPPLIER]);
  }

  goToPurchases(): void {
    this.lastAction = 'Ir a compras';
    this.router.navigate([ROUTE_PATHS.PURCHASE]);
  }

  goToStock(): void {
    this.lastAction = 'Ir a stock';
    this.router.navigate([ROUTE_PATHS.STOCK]);
  }

  getStatusLabel(status: ApiStatus): string {
    if (status === 'ONLINE') {
      return 'Conectada';
    }

    if (status === 'OFFLINE') {
      return 'Sin conexion';
    }

    return 'Verificando';
  }
}
