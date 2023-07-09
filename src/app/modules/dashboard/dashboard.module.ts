import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard.component';
import { HomeComponent } from './components/home/home.component'
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    MaterialModule

  ]
})
export class DashboardModule { }
