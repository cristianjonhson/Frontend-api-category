import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Componente base que proporciona funcionalidad común
 * Incluye gestión automática de suscripciones con takeUntil
 *
 * Uso:
 * export class MiComponente extends BaseComponent {
 *   ngOnInit() {
 *     this.miServicio.getData()
 *       .pipe(takeUntil(this.destroy$))
 *       .subscribe(...);
 *   }
 * }
 */
@Component({
  template: ''
})
export abstract class BaseComponent implements OnDestroy {
  /**
   * Subject para manejar la destrucción del componente
   * Usar con takeUntil para auto-unsubscribe
   */
  protected destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
