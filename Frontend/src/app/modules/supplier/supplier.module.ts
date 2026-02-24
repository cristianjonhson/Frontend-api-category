import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { SupplierListComponent } from './components/supplier-list/supplier-list.component';

@NgModule({
  declarations: [SupplierListComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule
  ],
  exports: [SupplierListComponent]
})
export class SupplierModule { }
