import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModuleOptimized } from '../shared/material-optimized.module';
import { CategoryModule } from '../category/category.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

/**
 * Módulo del Dashboard
 * Se carga de forma lazy desde app-routing.module.ts
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
    CategoryModule
  ]
})
export class DashboardModule { }
