import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea fechas usando convención chilena.
 */
@Pipe({
  name: 'chileanDate'
})
export class ChileanDatePipe implements PipeTransform {
  transform(value: string | number | Date | null | undefined, includeTime = false): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    const parsedDate = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...(includeTime
        ? {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }
        : {})
    }).format(parsedDate);
  }
}
