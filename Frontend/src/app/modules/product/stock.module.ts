import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../shared/shared.module';
import { StockManagementComponent } from './components';
import { StockRoutingModule } from './stock-routing.module';

@NgModule({
  declarations: [StockManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatTableModule,
    StockRoutingModule
  ]
})
export class StockModule { }
