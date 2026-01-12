import { Component } from '@angular/core';

/**
 * Componente raíz de la aplicación
 *
 * Este es el componente principal que se carga al iniciar la aplicación.
 * Actúa como contenedor para toda la aplicación Angular.
 *
 * @component
 * @selector app-root
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /** Título de la aplicación */
  title = 'front-inventory';
}
