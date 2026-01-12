# Backend API - Spring Boot

Este proyecto es el backend de una API REST construida con **Spring Boot** siguiendo principios de Clean Architecture. Provee endpoints para la gestión de categorías y otras entidades, utilizando PostgreSQL como base de datos.

## Tecnologías principales

- Java 11
- Spring Boot 2.7.13
- Spring Data JPA
- Spring Security
- PostgreSQL
- Flyway (migraciones)
- OpenAPI/Swagger (documentación)
- JUnit (pruebas)

## Requisitos previos

- Java 11+
- Maven 3.6+
- PostgreSQL (ejecutándose y accesible)
- (Opcional) Docker

## Configuración

1. **Clona el repositorio:**

   ```sh
   git clone https://github.com/tu-usuario/tu-repo.git
   cd tu-repo/Backend
   ```

2. **Configura la base de datos:**

   Edita el archivo `src/main/resources/application.properties` y ajusta los valores según tu entorno:

   ```
   spring.datasource.url=jdbc:postgresql://localhost:5432/app_db
   spring.datasource.username=admin
   spring.datasource.password=TU_PASSWORD
   spring.jpa.hibernate.ddl-auto=validate
   ```

3. **Ejecuta las migraciones (opcional):**

   Flyway ejecutará automáticamente las migraciones al iniciar la aplicación.

## Ejecución

### Desde Maven

```sh
./mvnw spring-boot:run
```

### Desde el JAR

```sh
./mvnw clean package
java -jar target/backend-1.0.0.jar
```

## Pruebas

Ejecuta las pruebas unitarias con:

```sh
./mvnw test
```

## Documentación de la API

Una vez levantado el backend, accede a la documentación interactiva en:

```
http://localhost:8080/swagger-ui.html
```
o
```
http://localhost:8080/swagger-ui/index.html
```

## Migraciones de base de datos

Las migraciones se gestionan automáticamente con Flyway. Coloca tus scripts SQL en `src/main/resources/db/migration`.

## Seguridad

El proyecto utiliza **Spring Security**. Por defecto, todas las rutas están abiertas (`permitAll()`), pero puedes personalizar la configuración en `WebSecurityConfig.java`.

## Estructura del proyecto

- `src/main/java/com/example` - Código fuente principal
- `src/main/resources` - Configuración y recursos
- `src/test/java/com/example` - Pruebas

## Licencia

MIT

---

> **Nota:** Si tienes problemas de conexión con la base de datos, asegúrate de que el servicio PostgreSQL esté corriendo y que los datos de acceso sean correctos.