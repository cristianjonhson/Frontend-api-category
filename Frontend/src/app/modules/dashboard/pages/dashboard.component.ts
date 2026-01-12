import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  /**
   * Inicialización del componente
   * Se ejecuta después de la creación del componente
   */
  ngOnInit(): void {
  }

}
