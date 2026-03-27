import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportService, IReport, IProductLowStock, ISupplierProductCount } from '../../services/report.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {
  report: IReport | null = null;
  isLoading = true;
  displayedLowStockColumns: string[] = ['name', 'categoryName', 'quantity', 'price'];
  displayedSupplierColumns: string[] = ['name', 'productCount'];

  private destroy$ = new Subject<void>();
  private readonly logCtx = '[Dashboard][ReportsComponent]';

  constructor(
    private reportService: ReportService,
    private logger: LoggerService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadReport();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga el reporte básico desde el servicio
   */
  private loadReport(): void {
    this.isLoading = true;
    this.reportService.getBasicReport()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (report) => {
          this.report = report;
          this.logger.info(`${this.logCtx} Reporte cargado exitosamente`);
        },
        error: (err) => {
          this.logger.error(`${this.logCtx} Error al cargar reporte`, err);
          this.notification.error('Error al cargar el reporte');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  /**
   * Recarga el reporte
   */
  refreshReport(): void {
    this.loadReport();
  }

  /**
   * Obtiene la clase de color para indicadores basado en valor
   */
  getStatCardClass(label: string, value: number): string {
    if (label === 'Stock Total' && value === 0) {
      return 'metric-card card rounded-4 border-0 shadow-sm metric-card--danger';
    }
    return 'metric-card card rounded-4 border-0 shadow-sm';
  }
}
