# Frontend API Category

Sistema de gestión de categorías desarrollado con Angular, que proporciona una interfaz moderna y responsiva para la administración de categorías de productos o inventarios.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Testing](#testing)
- [Build](#build)
- [Contribuir](#contribuir)

## 📖 Descripción

Frontend API Category es una aplicación web construida con Angular 16 que permite la gestión completa de categorías. La aplicación cuenta con autenticación mediante Keycloak, interfaz Material Design y una arquitectura modular bien organizada.

## ✨ Características

### Funcionalidades
- ✅ Gestión completa de categorías (CRUD)
- ✅ Autenticación y autorización con Keycloak
- ✅ Interfaz responsiva con Angular Material
- ✅ Diseño moderno con Material Design y Materialize CSS
- ✅ Dashboard administrativo con navegación lateral
- ✅ Formularios reactivos

### Arquitectura Avanzada
- ✅ **Lazy Loading** - Carga diferida de módulos (bundle reducido 66%: 1.37MB → 463KB)
- ✅ **Auto-unsubscribe** - BaseComponent con patrón takeUntil (prevención de memory leaks)
- ✅ **Error Handling** - GlobalErrorHandler + ErrorInterceptor centralizado
- ✅ **Notificaciones** - NotificationService con Material Snackbar
- ✅ **Logging** - LoggerService con niveles (DEBUG/INFO/WARN/ERROR)
- ✅ **Type Safety** - Interfaces, modelos y enums (cero "any")
- ✅ **Material Optimizado** - Solo 14 módulos esenciales (vs 40+ originales)
- ✅ **Clean Architecture** - Lógica de negocio en servicios, componentes presentacionales

## 🛠 Tecnologías

### Framework Principal
- **Angular** 16.1.3 - Framework frontend
- **TypeScript** 5.1.6 - Lenguaje de programación

### UI/UX
- **Angular Material** 16.1.4 - Componentes Material Design
- **Angular CDK** 16.1.4 - Component Dev Kit
- **Angular Flex Layout** 15.0.0 - Sistema de layout flexible
- **Materialize CSS** 1.0.0 - Framework CSS
- **Material Design Icons** 3.0.1 - Iconografía

### Autenticación
- **Keycloak Angular** 14.0.0 - Integración con Keycloak
- **Keycloak JS** 21.1.2 - Cliente JavaScript de Keycloak

### Herramientas de Desarrollo
- **Angular CLI** 16.1.3 - Herramienta de línea de comandos
- **Karma** 6.4.2 - Test runner
- **Jasmine** 5.0.1 - Framework de testing
- **TSLint** 6.1.3 - Linter para TypeScript
- **Protractor** 7.0.0 - Framework de testing E2E

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16.x o superior)
- **npm** (versión 8.x o superior)
- **Angular CLI** 16.x
  ```bash
  npm install -g @angular/cli@16
  ```

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd Frontend-api-category
   ```

2. **Instalar dependencias**
   ```bash
   npm install --legacy-peer-deps
   ```
   
   > **Nota**: Se usa `--legacy-peer-deps` debido a conflictos de peer dependencies entre versiones de Angular.

## ⚙️ Configuración

### Configuración de Entornos

El proyecto utiliza archivos de configuración de entorno ubicados en `src/environments/`:

- `environment.ts` - Configuración para desarrollo
- `environment.prod.ts` - Configuración para producción

Ejemplo de configuración:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  keycloak: {
    url: 'http://localhost:8180/auth',
    realm: 'tu-realm',
    clientId: 'tu-client-id'
  }
};
```

### Configuración de Keycloak

Asegúrate de configurar correctamente los parámetros de Keycloak en los archivos de entorno según tu instancia de Keycloak.

## 🏃 Ejecución

### Servidor de Desarrollo

```bash
npm start
```
o
```bash
ng serve
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si realizas cambios en los archivos fuente.

### Servidor de Desarrollo con Puerto Personalizado

```bash
ng serve --port 4300
```

### Servidor de Desarrollo Abierto al Público

```bash
ng serve --host 0.0.0.0
```

## 📁 Estructura del Proyecto

```
Frontend-api-category/
│
├── src/
│   ├── app/
│   │   ├── core/                      # ⭐ Servicios singleton y configuración global
│   │   │   ├── handlers/
│   │   │   │   └── global-error.handler.ts
│   │   │   ├── interceptors/
│   │   │   │   └── error.interceptor.ts
│   │   │   ├── services/
│   │   │   │   ├── logger.service.ts
│   │   │   │   └── notification.service.ts
│   │   │   └── core.module.ts
│   │   │
│   │   ├── shared/                    # ⭐ Recursos compartidos
│   │   │   ├── components/
│   │   │   │   └── base.component.ts  # Componente base con auto-unsubscribe
│   │   │   ├── models/
│   │   │   │   ├── api-response.model.ts
│   │   │   │   └── category.model.ts
│   │   │   ├── interfaces/
│   │   │   │   ├── api-metadata.interface.ts
│   │   │   │   ├── api-response.interface.ts
│   │   │   │   └── category.interface.ts
│   │   │   ├── enums/
│   │   │   │   ├── api-response-code.enum.ts
│   │   │   │   └── log-level.enum.ts
│   │   │   ├── constants/
│   │   │   │   ├── api.constants.ts
│   │   │   │   └── error-messages.constants.ts
│   │   │   └── styles/
│   │   │       └── notifications.css
│   │   │
│   │   ├── modules/
│   │   │   ├── category/              # Módulo de categorías
│   │   │   │   ├── components/
│   │   │   │   │   ├── category.component.*
│   │   │   │   │   └── new-category/
│   │   │   │   └── category.module.ts
│   │   │   │
│   │   │   ├── dashboard/             # Módulo del dashboard (Lazy Loading)
│   │   │   │   ├── components/
│   │   │   │   │   └── home/
│   │   │   │   ├── pages/
│   │   │   │   │   └── dashboard.component.*
│   │   │   │   ├── dashboard-routing.module.ts
│   │   │   │   └── dashboard.module.ts
│   │   │   │
│   │   │   └── shared/                # Módulo compartido
│   │   │       ├── components/
│   │   │       │   └── sidenav/
│   │   │       ├── services/
│   │   │       │   └── category.service.ts
│   │   │       ├── material-optimized.module.ts  # ⭐ Material optimizado
│   │   │       └── shared.module.ts
│   │   │
│   │   ├── app-routing.module.ts      # Enrutamiento principal con lazy loading
│   │   ├── app.component.*            # Componente raíz
│   │   └── app.module.ts              # Módulo raíz
│   │
│   ├── assets/                        # Recursos estáticos
│   ├── environments/                  # Configuraciones de entorno
│   ├── index.html                     # Página principal
│   ├── main.ts                        # Punto de entrada
│   ├── polyfills.ts                   # Polyfills
│   └── styles.css                     # Estilos globales
│
├── angular.json                       # Configuración de Angular
├── package.json                       # Dependencias del proyecto
├── tsconfig.json                      # Configuración de TypeScript
├── tslint.json                        # Configuración de TSLint
└── karma.conf.js                      # Configuración de Karma
```

### Descripción de Módulos

#### Core Module
Contiene servicios singleton y configuración global:
- **LoggerService**: Sistema de logging centralizado con niveles
- **NotificationService**: Gestión de notificaciones con Material Snackbar
- **ErrorInterceptor**: Interceptor HTTP para manejo centralizado de errores
- **GlobalErrorHandler**: Captura y gestiona errores no manejados

#### Shared Module
Recursos compartidos entre módulos:
- **BaseComponent**: Componente abstracto con auto-unsubscribe (takeUntil)
- **Models**: CategoryModel, ApiResponse con validación
- **Interfaces**: ICategory, IApiResponse, IApiMetadata
- **Enums**: ApiResponseCode, LogLevel
- **Constants**: API_CONSTANTS, ERROR_MESSAGES
- **MaterialModuleOptimized**: Solo 14 módulos Material esenciales

#### Feature Modules
- **Category Module**: Gestión completa de categorías (CRUD)
- **Dashboard Module**: Panel de control con lazy loading (optimización 66%)

## 📜 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests unitarios
npm test

# Ejecutar linter
npm run lint

# Ejecutar tests E2E
npm run e2e
```

## 🔧 Troubleshooting

### Error al instalar dependencias

Si encuentras errores de peer dependencies al ejecutar `npm install`, usa:

```bash
npm install --legacy-peer-deps
```

### Error "defaultProject" deprecado

Este proyecto ya no usa la propiedad `defaultProject` en angular.json (removida en Angular 14+).

### Vulnerabilidades de seguridad

Para revisar vulnerabilidades:

```bash
npm audit
```

Para intentar corregirlas automáticamente:

```bash
npm audit fix --legacy-peer-deps
```

## 🧪 Testing

### Tests Unitarios

```bash
npm test
```

Los tests se ejecutan mediante [Karma](https://karma-runner.github.io) y [Jasmine](https://jasmine.github.io/).

### Tests End-to-End

```bash
npm run e2e
```

Los tests E2E se ejecutan mediante [Protractor](http://www.protractortest.org/).

## 🏗 Build

### Build de Desarrollo

```bash
ng build
```

### Build de Producción

```bash
ng build --configuration production
```

Los artefactos de la construcción se almacenarán en el directorio `dist/`.

### Optimizaciones Implementadas

#### Optimizaciones de Angular
- **AOT Compilation**: Compilación Ahead-of-Time
- **Tree-shaking**: Eliminación de código no utilizado
- **Minificación**: Reducción del tamaño de archivos
- **Uglificación**: Ofuscación de código
- **Bundle optimization**: Optimización de paquetes

#### Optimizaciones Arquitecturales
- **Lazy Loading**: Carga diferida de módulos
  - Initial Bundle: 464.66 KB (vs 1.37 MB original)
  - Reducción: 66% en el bundle inicial
- **Material Optimizado**: 14 módulos vs 40+ originales
- **Import paths absolutos**: Mejora en tree-shaking
- **Auto-unsubscribe**: Prevención de memory leaks

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Convenciones de Código

- Seguir las guías de estilo de Angular
- Utilizar TypeScript strict mode
- Documentar funciones y componentes complejos
- Mantener componentes pequeños y enfocados
- Escribir tests para nuevas funcionalidades

## 📄 Licencia

Este proyecto es privado y no está bajo ninguna licencia de código abierto.

## 👥 Autores

Desarrollado con ❤️ por el equipo de desarrollo

## 📞 Soporte

Para soporte o preguntas, por favor contacta al equipo de desarrollo.

---

**Nota**: Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 16.1.3.
