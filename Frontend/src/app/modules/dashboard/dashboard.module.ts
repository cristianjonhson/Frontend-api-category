import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModuleOptimized } from '../shared/material-optimized.module';
import { CategoryModule } from '../category/category.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ProductModule } from '../product/product.module';

/**
 * Módulo principal del Dashboard
 *
 * Feature module con lazy loading que contiene el panel de control
 * administrativo y sus componentes relacionados. Se carga bajo demanda
 * cuando el usuario accede a la ruta /dashboard.
 *
 * Este módulo importa CategoryModule para incluir las funcionalidades
 * de gestión de categorías dentro del dashboard.
 *
 * @module
 */
@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MaterialModuleOptimized,
    CategoryModule,
    ProductModule
  ]
})
export class DashboardModule { }
