import { NgModule } from '@angular/core';

// Importar solo los módulos necesarios
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

/**
 * Módulo de Angular Material optimizado
 *
 * Importa y exporta únicamente los módulos de Material Design que
 * se están utilizando en la aplicación. Esto reduce el tamaño del
 * bundle final significativamente (14 módulos vs 40+ del MaterialModule completo).
 *
 * @module
 * @optimized
 *
 * Componentes incluidos:
 * - Button: Botones con estilos Material
 * - Card: Tarjetas con contenido
 * - Dialog: Diálogos modales
 * - FormField: Campos de formulario
 * - Icon: Íconos Material
 * - Input: Inputs de texto
 * - List: Listas
 * - Menu: Menús desplegables
 * - Paginator: Paginación de tablas
 * - Sidenav: Navegación lateral
 * - SnackBar: Notificaciones toast
 * - Table: Tablas de datos
 * - Toolbar: Barras de herramientas
 */
const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES
})
export class MaterialModuleOptimized {}
