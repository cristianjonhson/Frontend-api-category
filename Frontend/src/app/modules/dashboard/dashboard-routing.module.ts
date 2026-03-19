import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { HomeComponent } from './components/home/home.component';
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
        loadChildren: () => import('../category/category.module').then(m => m.CategoryModule)
      },
      {
        path: ROUTES.PRODUCT,
        loadChildren: () => import('../product/product.module').then(m => m.ProductModule)
      },
      {
        path: ROUTES.STOCK,
        loadChildren: () => import('../product/stock.module').then(m => m.StockModule)
      },
      {
        path: ROUTES.SUPPLIER,
        loadChildren: () => import('../supplier/supplier.module').then(m => m.SupplierModule)
      },
      {
        path: ROUTES.PURCHASE,
        loadChildren: () => import('../purchase/purchase.module').then(m => m.PurchaseModule)
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

