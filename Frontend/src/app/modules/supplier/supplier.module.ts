import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { SupplierRoutingModule } from './supplier-routing.module';
import {
  SupplierCreateDialogComponent,
  SupplierEditDialogComponent,
  SupplierListComponent
} from './components';

@NgModule({
  declarations: [SupplierListComponent, SupplierCreateDialogComponent, SupplierEditDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    SupplierRoutingModule
  ]
})
export class SupplierModule { }
