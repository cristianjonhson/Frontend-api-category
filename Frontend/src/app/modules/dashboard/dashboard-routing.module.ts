import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from '../category/components/list-category/category.component';
import { ProductListComponent } from '../product/components/product-list/product-list.component';
import { StockManagementComponent } from '../product/components/stock-management/stock-management.component';
import { ROUTES } from '../../shared/constants/routes.constants';

/**
 * Rutas del módulo Dashboard
 * Incluye rutas hijas para navegación dentro del dashboard
 */
const routes: Routes = [
  {
    path: ROUTES.ROOT,
    component: DashboardComponent,
    children: [
      {
        path: ROUTES.ROOT,
        redirectTo: ROUTES.HOME,
        pathMatch: 'full'
      },
      {
        path: ROUTES.HOME,
        component: HomeComponent
      },
      {
        path: ROUTES.CATEGORY,
        component: CategoryComponent
      },
      {
        path: ROUTES.PRODUCT,
        component: ProductListComponent
      },
      {
        path: ROUTES.STOCK,
        component: StockManagementComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
/**
 * Módulo de enrutamiento del Dashboard
 *
 * Define las rutas hijas para la sección de dashboard.
 * Incluye rutas para Home y Category como hijos del DashboardComponent.
 *
 * @module
 */
export class DashboardRoutingModule { }

