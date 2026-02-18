import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductCreateDialogComponent } from './components/product-add/product-create-dialog.component';
import { ProductEditDialogComponent } from './components/product-edit/product-edit-dialog.component';
import { StockManagementComponent } from './components/stock-management/stock-management.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductCreateDialogComponent,
    ProductEditDialogComponent,
    StockManagementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  exports: [ProductListComponent, StockManagementComponent]
})
export class ProductModule { }
