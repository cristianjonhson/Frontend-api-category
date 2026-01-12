# Guía de Documentación TSDoc/JSDoc

## ¿Qué es TSDoc?

**TSDoc** es el estándar de documentación para TypeScript, similar a JavaDoc en Java. También se conoce como JSDoc cuando se usa con JavaScript. Permite documentar código usando comentarios especiales que pueden ser procesados por herramientas de generación de documentación.

## Sintaxis Básica

### Comentarios de Documentación

Los comentarios de documentación comienzan con `/**` y terminan con `*/`:

```typescript
/**
 * Descripción breve de la clase, método o propiedad
 * 
 * Descripción más detallada si es necesaria.
 * Puede incluir múltiples líneas.
 */
```

## Tags Comunes

### @param - Parámetros de función

Documenta los parámetros de una función o método:

```typescript
/**
 * Calcula la suma de dos números
 * @param a - Primer número
 * @param b - Segundo número
 * @returns La suma de a y b
 */
function sumar(a: number, b: number): number {
  return a + b;
}
```

### @returns - Valor de retorno

Describe qué retorna una función:

```typescript
/**
 * Obtiene el usuario actual
 * @returns Observable con los datos del usuario
 */
getCurrentUser(): Observable<User> {
  return this.http.get<User>('/api/user');
}
```

### @component - Componentes Angular

Identifica un componente de Angular:

```typescript
/**
 * Componente para la gestión de categorías
 * 
 * @component
 * @selector app-category
 * @extends BaseComponent
 */
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent extends BaseComponent { }
```

### @module - Módulos

Documenta módulos de Angular:

```typescript
/**
 * Módulo principal del Dashboard
 * 
 * @module
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule]
})
export class DashboardModule { }
```

### @Injectable - Servicios

Documenta servicios inyectables:

```typescript
/**
 * Servicio para gestionar categorías
 * 
 * @Injectable
 * @providedIn 'root'
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService { }
```

### @deprecated - Elementos obsoletos

Marca código que ya no debe usarse:

```typescript
/**
 * @deprecated Usar newMethod() en su lugar
 */
oldMethod(): void {
  // ...
}
```

### @example - Ejemplos de uso

Proporciona ejemplos de cómo usar el código:

```typescript
/**
 * Formatea un nombre completo
 * 
 * @param firstName - Nombre
 * @param lastName - Apellido
 * @returns Nombre formateado
 * 
 * @example
 * ```typescript
 * const fullName = formatName('Juan', 'Pérez');
 * console.log(fullName); // "Juan Pérez"
 * ```
 */
function formatName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}
```

### @throws - Excepciones

Documenta las excepciones que puede lanzar un método:

```typescript
/**
 * Divide dos números
 * @param a - Dividendo
 * @param b - Divisor
 * @returns Resultado de la división
 * @throws {Error} Si b es cero
 */
function dividir(a: number, b: number): number {
  if (b === 0) {
    throw new Error('División por cero');
  }
  return a / b;
}
```

### @see - Referencias

Crea enlaces a otros elementos de código:

```typescript
/**
 * Procesa una categoría
 * @see CategoryService.saveCategory para guardar
 * @see ICategory para la interfaz
 */
processCategory(category: ICategory): void {
  // ...
}
```

## Buenas Prácticas

### 1. Documentar elementos públicos

Siempre documenta:
- Clases públicas
- Métodos públicos
- Propiedades públicas
- Interfaces
- Enums
- Funciones exportadas

### 2. Ser conciso pero completo

```typescript
// ❌ Demasiado breve
/** Obtiene datos */
getData(): void { }

// ✅ Mejor
/**
 * Obtiene las categorías desde la API
 * @returns Observable con array de categorías
 */
getCategories(): Observable<ICategory[]> { }
```

### 3. Usar tipos en @param

```typescript
/**
 * @param {string} name - Nombre de la categoría
 * @param {number} id - ID de la categoría
 */
```

O aprovechar TypeScript (inferencia de tipos):

```typescript
/**
 * @param name - Nombre de la categoría
 * @param id - ID de la categoría
 */
```

### 4. Documentar el propósito, no la implementación

```typescript
// ❌ Documenta implementación
/**
 * Hace un HTTP GET a /api/categories y mapea la respuesta
 */
getCategories(): Observable<ICategory[]> { }

// ✅ Documenta propósito
/**
 * Obtiene todas las categorías disponibles
 * @returns Observable con array de categorías
 */
getCategories(): Observable<ICategory[]> { }
```

### 5. Mantener la documentación actualizada

Cuando cambies código, actualiza también su documentación.

## Ejemplos del Proyecto

### Componente

```typescript
/**
 * Componente para la gestión de categorías
 * 
 * Componente smart que maneja la visualización y gestión de categorías.
 * Extiende BaseComponent para auto-unsubscribe de observables.
 * Utiliza Material Table para mostrar los datos en formato tabular.
 * 
 * @component
 * @selector app-category
 * @extends BaseComponent
 */
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent extends BaseComponent implements OnInit {
  /**
   * Constructor del componente
   * @param categoryService - Servicio para operaciones CRUD de categorías
   * @param dialog - Servicio de Material Dialog para abrir modales
   * @param logger - Servicio centralizado de logging
   * @param notification - Servicio para mostrar notificaciones al usuario
   */
  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private logger: LoggerService,
    private notification: NotificationService
  ) {
    super();
  }
}
```

### Servicio

```typescript
/**
 * Servicio para gestionar categorías
 * 
 * Proporciona métodos para operaciones CRUD de categorías.
 * Incluye lógica de negocio para procesar respuestas de la API.
 * 
 * @Injectable
 * @providedIn 'root'
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  /**
   * Obtiene todas las categorías
   * @returns Observable con array de categorías procesadas
   */
  getCategories(): Observable<ICategory[]> {
    // ...
  }
}
```

### Interface

```typescript
/**
 * Interface para una categoría
 * 
 * Define la estructura de datos para representar una categoría
 * en el sistema.
 */
export interface ICategory {
  /** Identificador único de la categoría */
  id: number;
  
  /** Nombre descriptivo de la categoría */
  name: string;
  
  /** Descripción detallada de la categoría */
  description: string;
}
```

### Enum

```typescript
/**
 * Enum para códigos de respuesta de la API
 * 
 * Define los códigos estándar que la API puede retornar
 * en el campo metadata[].code
 */
export enum ApiResponseCode {
  /** Operación exitosa */
  SUCCESS = '00',
  
  /** Error general */
  ERROR = '01',
  
  /** Recurso no encontrado */
  NOT_FOUND = '04',
  
  /** Usuario no autorizado */
  UNAUTHORIZED = '03',
  
  /** Petición mal formada */
  BAD_REQUEST = '02'
}
```

## Herramientas de Generación

### TypeDoc

TypeDoc es la herramienta más popular para generar documentación HTML desde comentarios TSDoc:

```bash
# Instalar
npm install --save-dev typedoc

# Generar documentación
npx typedoc --out docs src
```

### Compodoc (Angular)

Para proyectos Angular, Compodoc es la mejor opción:

```bash
# Instalar
npm install --save-dev @compodoc/compodoc

# Generar documentación
npx compodoc -p tsconfig.json

# Servir documentación
npx compodoc -s
```

## Referencias

- [TSDoc Official](https://tsdoc.org/)
- [JSDoc Official](https://jsdoc.app/)
- [TypeDoc](https://typedoc.org/)
- [Compodoc](https://compodoc.app/)
- [Angular Style Guide](https://angular.io/guide/styleguide)

## Convenciones del Proyecto

1. ✅ Todos los componentes deben tener documentación TSDoc
2. ✅ Todos los servicios deben documentar métodos públicos
3. ✅ Todas las interfaces deben tener descripción
4. ✅ Los parámetros complejos deben estar documentados
5. ✅ Usar `@param` para todos los parámetros
6. ✅ Usar `@returns` para todos los valores de retorno
7. ✅ Agregar `@example` cuando el uso no sea obvio
8. ✅ Mantener documentación sincronizada con el código
