import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea fechas usando convención chilena.
 */
@Pipe({
  name: 'chileanDate'
})
export class ChileanDatePipe implements PipeTransform {
  transform(
    value: string | number | Date | null | undefined,
    format: 'date' | 'datetime' | 'short' | boolean = 'date'
  ): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const parsedDate = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return '-';
    }

    // Compatibilidad hacia atrás: chileanDate:true
    if (typeof format === 'boolean') {
      return this.formatDate(parsedDate, format ? 'datetime' : 'date');
    }

    return this.formatDate(parsedDate, format);
  }

  private formatDate(parsedDate: Date, format: 'date' | 'datetime' | 'short'): string {
    if (format === 'short') {
      return new Intl.DateTimeFormat('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(parsedDate);
    }

    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...(format === 'datetime'
        ? {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }
        : {})
    }).format(parsedDate);
  }
}
