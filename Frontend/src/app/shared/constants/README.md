# Constantes Compartidas (Shared Constants)

Este directorio contiene constantes reutilizables organizadas por categoría para mantener la coherencia en toda la aplicación.

## Estructura

```
constants/
├── api.constants.ts         # Configuración de API y endpoints
├── ui.constants.ts          # Configuración de interfaz de usuario
├── messages.constants.ts    # Mensajes de notificación y texto
└── index.ts                 # Barrel export
```

## Uso

### Importación Simple

```typescript
import { DIALOG_CONFIG, TIMING, SUCCESS_MESSAGES } from 'src/app/shared/constants';
```

### Importación Específica

```typescript
import { PAGINATOR_CONFIG } from 'src/app/shared/constants/ui.constants';
import { ERROR_MESSAGES } from 'src/app/shared/constants/messages.constants';
```

## Constantes Disponibles

### 1. UI Constants (`ui.constants.ts`)

#### TIMING
Configuraciones de tiempo en milisegundos:
```typescript
TIMING.SEARCH_DEBOUNCE        // 300ms - Para búsquedas y filtros
TIMING.NOTIFICATION_DURATION  // 3000ms - Duración de notificaciones
TIMING.HTTP_TIMEOUT          // 30000ms - Timeout de peticiones HTTP
```

#### DIALOG_CONFIG
Configuraciones de diálogos modales:
```typescript
DIALOG_CONFIG.FORM           // { width: '600px', height: '400px' }
DIALOG_CONFIG.CONFIRMATION   // { width: '400px', maxWidth: '90vw' }
DIALOG_CONFIG.PRODUCT_FORM   // { width: '520px', disableClose: false }
```

**Ejemplo de uso:**
```typescript
const dialogRef = this.dialog.open(MyComponent, DIALOG_CONFIG.FORM);
```

**Con propiedades adicionales:**
```typescript
const dialogRef = this.dialog.open(MyComponent, {
  ...DIALOG_CONFIG.FORM,
  data: { someData }
});
```

#### PAGINATOR_CONFIG
Configuraciones del paginador:
```typescript
PAGINATOR_CONFIG.PAGE_SIZE_OPTIONS        // [5, 10, 20]
PAGINATOR_CONFIG.DEFAULT_PAGE_SIZE        // 10
PAGINATOR_CONFIG.SHOW_FIRST_LAST_BUTTONS  // true
```

**Uso en template:**
```html
<mat-paginator 
  [pageSizeOptions]="paginatorConfig.PAGE_SIZE_OPTIONS"
  [showFirstLastButtons]="paginatorConfig.SHOW_FIRST_LAST_BUTTONS">
</mat-paginator>
```

**Requerido en componente:**
```typescript
readonly paginatorConfig = PAGINATOR_CONFIG;
```

#### BREAKPOINTS
Puntos de ruptura responsivos:
```typescript
BREAKPOINTS.MOBILE   // 600px
BREAKPOINTS.TABLET   // 960px
BREAKPOINTS.DESKTOP  // 1280px
```

### 2. Messages Constants (`messages.constants.ts`)

#### SUCCESS_MESSAGES
Mensajes de éxito para notificaciones:
```typescript
SUCCESS_MESSAGES.CATEGORY_CREATED  // 'Categoría agregada exitosamente'
SUCCESS_MESSAGES.CATEGORY_UPDATED  // 'Categoría actualizada exitosamente'
SUCCESS_MESSAGES.CATEGORY_DELETED  // 'Categoría eliminada exitosamente'
SUCCESS_MESSAGES.PRODUCT_CREATED   // 'Producto agregado exitosamente'
// ... etc
```

**Ejemplo:**
```typescript
this.notification.success(SUCCESS_MESSAGES.CATEGORY_CREATED);
```

#### ERROR_MESSAGES
Mensajes de error para notificaciones:
```typescript
ERROR_MESSAGES.NETWORK_ERROR          // Error de conexión
ERROR_MESSAGES.CATEGORY_LOAD_ERROR    // Error al cargar categorías
ERROR_MESSAGES.VALIDATION_ERROR       // Error de validación
// ... etc
```

**Ejemplo:**
```typescript
this.notification.error(ERROR_MESSAGES.CATEGORY_LOAD_ERROR);
```

#### INFO_MESSAGES
Mensajes informativos:
```typescript
INFO_MESSAGES.NO_CATEGORIES  // 'No se encontraron categorías'
INFO_MESSAGES.NO_PRODUCTS    // 'No se encontraron productos'
INFO_MESSAGES.LOADING        // 'Cargando...'
```

#### CONFIRMATION_MESSAGES
Mensajes de confirmación (funciones):
```typescript
CONFIRMATION_MESSAGES.DELETE_CATEGORY(name)  // Retorna: '¿Eliminar la categoría "nombre"?'
CONFIRMATION_MESSAGES.DELETE_PRODUCT(name)   // Retorna: '¿Eliminar el producto "nombre"?'
CONFIRMATION_MESSAGES.CONFIRM_DELETE         // Mensaje genérico
```

**Ejemplo:**
```typescript
const confirmed = window.confirm(
  CONFIRMATION_MESSAGES.DELETE_CATEGORY(category.name)
);
```

#### FORM_LABELS
Etiquetas para formularios y campos:
```typescript
FORM_LABELS.NAME               // 'Nombre'
FORM_LABELS.SEARCH_CATEGORY   // 'Buscar Categorias'
FORM_LABELS.ADD_CATEGORY      // 'Agregar Nueva Categoría'
FORM_LABELS.SAVE              // 'Guardar'
// ... etc
```

#### PAGE_TITLES
Títulos de páginas:
```typescript
PAGE_TITLES.CATEGORY_LIST  // 'Listado de Categorias'
PAGE_TITLES.PRODUCT_LIST   // 'Listado de Productos'
```

### 3. API Constants (`api.constants.ts`)

#### API_CONFIG
Configuración de API:
```typescript
API_CONFIG.ENDPOINTS.CATEGORIES    // '/categories'
API_CONFIG.ENDPOINTS.PRODUCTS      // '/products'
API_CONFIG.TIMEOUT                 // 30000
API_CONFIG.RETRY_ATTEMPTS          // 3
API_CONFIG.STATUS_CODES.OK         // 200
API_CONFIG.STATUS_CODES.NOT_FOUND  // 404
// ... etc
```

## Ejemplo Completo

### Componente refactorizado usando constantes:

**Antes:**
```typescript
export class CategoryComponent {
  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '600px',
      height: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notification.success('Categoría agregada exitosamente');
      }
    });
  }

  onDelete(category: Category): void {
    if (window.confirm(`¿Eliminar la categoría "${category.name}"?`)) {
      this.service.delete(category.id).subscribe({
        next: () => this.notification.success('Categoría eliminada exitosamente'),
        error: () => this.notification.error('Error al eliminar categoría')
      });
    }
  }
}
```

**Después:**
```typescript
import { DIALOG_CONFIG, SUCCESS_MESSAGES, ERROR_MESSAGES, CONFIRMATION_MESSAGES } from 'src/app/shared/constants';

export class CategoryComponent {
  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryComponent, DIALOG_CONFIG.FORM);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notification.success(SUCCESS_MESSAGES.CATEGORY_CREATED);
      }
    });
  }

  onDelete(category: Category): void {
    if (window.confirm(CONFIRMATION_MESSAGES.DELETE_CATEGORY(category.name))) {
      this.service.delete(category.id).subscribe({
        next: () => this.notification.success(SUCCESS_MESSAGES.CATEGORY_DELETED),
        error: () => this.notification.error(ERROR_MESSAGES.CATEGORY_DELETE_ERROR)
      });
    }
  }
}
```

## Beneficios

1. **Consistencia**: Todos los componentes usan los mismos valores
2. **Mantenibilidad**: Cambios centralizados
3. **Type Safety**: TypeScript valida las constantes
4. **Documentación**: Valores autodocumentados
5. **Testing**: Fácil de mockear y testear
6. **i18n Ready**: Preparado para internacionalización futura

## Mejores Prácticas

1. **Usar `as const`**: Todas las constantes usan `as const` para inmutabilidad
2. **Nombrado descriptivo**: Nombres en UPPER_SNAKE_CASE
3. **Agrupación lógica**: Constantes relacionadas agrupadas
4. **Documentación**: JSDoc para cada constante
5. **Barrel exports**: Usar el archivo `index.ts` para importaciones

## Extensión

Para agregar nuevas constantes:

1. Identificar si es UI, mensaje o API
2. Agregar al archivo correspondiente
3. Documentar con JSDoc
4. Usar `as const` para inmutabilidad
5. Actualizar este README si es necesario
