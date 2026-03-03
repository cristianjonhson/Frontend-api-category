import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SharedPaginatorComponent } from './components/paginator/shared-paginator.component';
import { ClpCurrencyPipe } from './pipes/clp-currency.pipe';
import { MaterialModuleOptimized } from './material-optimized.module';

/**
 * Módulo compartido
 *
 * Contiene componentes, directivas y pipes que se comparten entre
 * múltiples feature modules. Exporta módulos comunes como CommonModule,
 * RouterModule y MaterialModuleOptimized para que puedan ser utilizados
 * por los módulos que lo importen.
 *
 * @module
 * @exports SidenavComponent - Componente de navegación lateral
 * @exports CommonModule - Módulo común de Angular
 * @exports RouterModule - Módulo de enrutamiento
 * @exports FlexLayoutModule - Módulo para layouts flexibles
 * @exports MaterialModuleOptimized - Módulos de Material optimizados
 */
@NgModule({
  declarations: [
    SidenavComponent,
    SharedPaginatorComponent,
    ClpCurrencyPipe
  ],
  exports: [
    SidenavComponent,
    SharedPaginatorComponent,
    ClpCurrencyPipe,
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
