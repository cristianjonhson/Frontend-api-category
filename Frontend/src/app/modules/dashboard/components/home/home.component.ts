import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { CategoryService } from '../../../category/services';
import { ApiStatus, HomeService } from '../../services/home.service';
import { ROUTE_PATHS } from '../../../../shared/constants/routes.constants';

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
    private router: Router,
    public homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.showTips = this.homeService.getShowTipsPreference();
    this.loadSummary();
  }

  loadSummary(): void {
    this.apiStatus = 'LOADING';

    this.categoryService.getCategories().pipe(take(1)).subscribe({
      next: (categories) => {
        this.categoriesCount = categories.length;
        this.apiStatus = 'ONLINE';
        this.lastUpdated = this.homeService.getCurrentTimestamp();
      },
      error: () => {
        this.categoriesCount = 0;
        this.apiStatus = 'OFFLINE';
        this.lastUpdated = this.homeService.getCurrentTimestamp();
      }
    });
  }

  toggleTips(value: boolean): void {
    this.showTips = value;
    this.homeService.setShowTipsPreference(value);
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
}
