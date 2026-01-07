import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';

/**
 * Componente de navegación lateral
 *
 * Proporciona el menú de navegación principal de la aplicación.
 * Es responsivo y se adapta a dispositivos móviles usando MediaMatcher.
 *
 * @component
 * @selector app-sidenav
 */
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  /** Propiedad del menú (sin uso actual) */
  menu: any;

  /** Query para detectar si es dispositivo móvil (max-width: 600px) */
  mobileQuery: MediaQueryList;

  /**
   * Configuración de elementos del menú de navegación
   * Cada item contiene nombre, ruta e ícono Material
   */
  menuNav = [
    {name: "Home", route: "home", icon: "home"},
    {name: "Categorias", route: "category", icon: "category"},
    {name: "Productos", route: "product", icon: "production_quantity_limits"}
  ]

  /**
   * Constructor del componente
   * @param media - Servicio para ejecutar media queries
   */
  constructor(media: MediaMatcher) {
    this.mobileQuery = media.matchMedia(('max-width: 600px'));
  }

  /**
   * Inicialización del componente
   * Se ejecuta después de la creación del componente
   */
  ngOnInit(): void {
  }

}
