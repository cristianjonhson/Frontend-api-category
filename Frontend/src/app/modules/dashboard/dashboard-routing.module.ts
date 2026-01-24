import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { CategoryComponent } from '../category/components/list-category/category.component';
import { ProductListComponent } from '../product/components/product-list/product-list.component';

/**
 * Rutas del módulo Dashboard
 * Incluye rutas hijas para navegación dentro del dashboard
 */
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'category',
        component: CategoryComponent
      },
      {
        path: 'product',
        component: ProductListComponent
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

