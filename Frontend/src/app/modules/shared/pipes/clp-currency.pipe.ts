import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea valores numéricos como moneda peso chileno.
 */
@Pipe({
  name: 'clpCurrency'
})
export class ClpCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const parsedValue = typeof value === 'string'
      ? Number(value.replace(',', '.'))
      : value;

    if (Number.isNaN(parsedValue)) {
      return '';
    }

    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parsedValue);
  }
}
