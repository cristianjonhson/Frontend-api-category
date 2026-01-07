import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MaterialModule } from './material.module';

/**
 * Shared Module - Componentes, directivas y pipes compartidos
 * Puede ser importado por cualquier feature module
 */
@NgModule({
  declarations: [
    SidenavComponent
  ],
  exports: [
    SidenavComponent,
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModule
  ]
})
export class SharedModule { }
