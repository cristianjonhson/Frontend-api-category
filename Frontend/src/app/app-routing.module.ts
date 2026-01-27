import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * Configuración de rutas principales de la aplicación
 * Todas las rutas usan lazy loading para optimizar el tiempo de carga inicial
 */
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '**',
    redirectTo: '/dashboard' // Redirigir rutas no encontradas al dashboard
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
