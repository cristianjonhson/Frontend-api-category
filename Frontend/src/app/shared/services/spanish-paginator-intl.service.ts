import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

/**
 * Servicio para personalizar las etiquetas del paginador de Material en español
 * 
 * @description
 * Este servicio extiende MatPaginatorIntl para proporcionar traducciones
 * en español de todas las etiquetas del paginador de Angular Material.
 * 
 * @usage
 * Proveer este servicio en el módulo:
 * ```typescript
 * providers: [
 *   { provide: MatPaginatorIntl, useClass: SpanishPaginatorIntl }
 * ]
 * ```
 * 
 * @class SpanishPaginatorIntl
 * @extends MatPaginatorIntl
 */
@Injectable()
export class SpanishPaginatorIntl extends MatPaginatorIntl {
  
  constructor() {
    super();
    this.configurePaginatorLabels();
  }

  /**
   * Configura todas las etiquetas del paginador en español
   */
  private configurePaginatorLabels(): void {
    this.itemsPerPageLabel = 'Elementos por página:';
    this.nextPageLabel = 'Página siguiente';
    this.previousPageLabel = 'Página anterior';
    this.firstPageLabel = 'Primera página';
    this.lastPageLabel = 'Última página';
    this.getRangeLabel = this.getRangeLabelInSpanish;
  }

  /**
   * Genera la etiqueta de rango en español (ej: "1 - 10 de 50")
   * @param page Número de página actual
   * @param pageSize Tamaño de página
   * @param length Total de elementos
   * @returns Etiqueta de rango formateada
   */
  private getRangeLabelInSpanish = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`;
    }
    
    const startIndex = page * pageSize;
    const endIndex = startIndex < length 
      ? Math.min(startIndex + pageSize, length) 
      : startIndex + pageSize;
    
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
}
