import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'purchaseStatusEs'
})
export class PurchaseStatusEsPipe implements PipeTransform {
  private readonly statusMap: Record<string, string> = {
    PENDING: 'Pendiente',
    PARTIALLY_RECEIVED: 'Recibida parcialmente',
    RECEIVED: 'Recibida'
  };

  transform(value: string | null | undefined): string {
    const normalized = (value ?? '').toString().trim().toUpperCase();

    if (!normalized) {
      return 'Sin estado';
    }

    return this.statusMap[normalized] ?? value!.toString();
  }
}
