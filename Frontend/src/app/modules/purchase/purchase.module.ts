import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { SharedModule } from '../shared/shared.module';
import { PurchaseManagementComponent } from './components/purchase-management/purchase-management.component';

@NgModule({
  declarations: [PurchaseManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [PurchaseManagementComponent]
})
export class PurchaseModule { }
