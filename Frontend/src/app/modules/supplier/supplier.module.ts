import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { SupplierListComponent } from './components/supplier-list/supplier-list.component';
import { SupplierCreateDialogComponent } from './components/supplier-add/supplier-create-dialog.component';

@NgModule({
  declarations: [SupplierListComponent, SupplierCreateDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  exports: [SupplierListComponent]
})
export class SupplierModule { }
