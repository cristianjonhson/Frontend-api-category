import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES, ROUTE_PATHS } from 'src/app/shared/constants/routes.constants';

/**
 * Configuración de rutas principales de la aplicación
 * Todas las rutas usan lazy loading para optimizar el tiempo de carga inicial
 */
const routes: Routes = [
  {
    path: ROUTES.ROOT,
    pathMatch: 'full',
    redirectTo: ROUTE_PATHS.DASHBOARD
  },
  {
    path: ROUTES.DASHBOARD,
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: ROUTES.WILDCARD,
    redirectTo: ROUTE_PATHS.DASHBOARD // Redirigir rutas no encontradas al dashboard
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false // Cambiar a true para debugging
    })
  ],
  exports: [RouterModule]
})
/**
 * Módulo principal de enrutamiento
 *
 * Configura las rutas raíz de la aplicación usando lazy loading.
 * Todas las feature modules se cargan bajo demanda para optimizar
 * el tiempo de carga inicial.
 *
 * @module
 */
export class AppRoutingModule { }
