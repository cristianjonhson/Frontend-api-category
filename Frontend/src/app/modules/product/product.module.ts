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

import {
  ProductCreateDialogComponent,
  ProductEditDialogComponent,
  ProductListComponent,
  StockManagementComponent
} from './components';

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
