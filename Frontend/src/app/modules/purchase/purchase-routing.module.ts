import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseManagementComponent } from './components/purchase-management/purchase-management.component';

const routes: Routes = [
  { path: '', component: PurchaseManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
