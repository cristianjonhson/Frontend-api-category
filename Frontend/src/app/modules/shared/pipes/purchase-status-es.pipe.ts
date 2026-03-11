import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'purchaseStatusEs'
})
export class PurchaseStatusEsPipe implements PipeTransform {
  private readonly statusMap: Record<string, string> = {
    PENDING: 'Pendiente',
    PARTIALLY_RECEIVED: 'Recibida parcialmente',
    RECEIVED: 'Recibida',
    CANCELLED: 'Cancelada',
    CANCELED: 'Cancelada'
  };

  transform(value: unknown): string {
    try {
      const raw = value == null ? '' : String(value);
      const normalized = raw.trim().toUpperCase();

      if (!normalized) {
        return 'Sin estado';
      }

      return this.statusMap[normalized] ?? raw;
    } catch {
      return 'Sin estado';
    }
  }
}
