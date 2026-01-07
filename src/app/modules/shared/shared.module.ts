import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MaterialModuleOptimized } from './material-optimized.module';

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
    MaterialModuleOptimized
  ],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    MaterialModuleOptimized
  ]
})
export class SharedModule { }
