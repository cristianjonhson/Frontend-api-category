import { Component, OnInit } from '@angular/core';

/**
 * Componente para crear/editar categorías
 *
 * Diálogo modal que permite crear nuevas categorías o editar existentes.
 * Contiene un formulario reactivo con validaciones.
 *
 * @component
 * @selector app-new-category
 * @example
 * ```typescript
 * const dialogRef = this.dialog.open(NewCategoryComponent, {
 *   width: '450px',
 *   data: { category: existingCategory } // Opcional para editar
 * });
 * ```
 */
@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit {

  constructor() { }

  /**
   * Inicialización del componente
   * Se ejecuta después de la creación del componente.
   * Aquí se debería inicializar el formulario reactivo.
   */
  ngOnInit(): void {
  }

}
