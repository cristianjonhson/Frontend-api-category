import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../shared/constants/routes.constants';

/**
 * Componente principal del Dashboard
 *
 * Actúa como página contenedora del dashboard administrativo.
 * Contiene el layout principal con sidenav y router-outlet para las vistas hijas.
 *
 * @component
 * @selector app-dashboard
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  /**
   * Inicialización del componente
   * Se ejecuta después de la creación del componente
   */
  ngOnInit(): void {
    // Fallback defensivo: si no hay ruta hija activa, dirigir a Home.
    if (!this.route.snapshot.firstChild) {
      this.router.navigate([ROUTES.HOME], { relativeTo: this.route });
    }
  }

}
