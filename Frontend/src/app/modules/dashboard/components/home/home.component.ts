import { Component, OnInit } from '@angular/core';

/**
 * Componente de la página de inicio
 *
 * Página principal del dashboard que muestra información de bienvenida
 * o widgets de resumen. Es la primera vista que ve el usuario al ingresar
 * al sistema.
 *
 * @component
 * @selector app-home
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  /**
   * Inicialización del componente
   * Se ejecuta después de la creación del componente
   */
  ngOnInit(): void {
  }

}
