# GRUPO 10 - Backend API - Sistema de Gestión de Entrenamiento (TP Final)

## INTEGRANTES

- Ramiro Stallone
- Ignacio Ramirez Labadie
- Juan Foricher Castellón
- Emmanuel Franco
- Ignacio Callava

## Descripción del Proyecto

Esta es una API REST desarrollada como backend para un sistema de gestión de entrenamiento físico, permitiendo la administración de **ejercicios**, **rutinas**, **entrenamientos** y **estadísticas**. El proyecto utiliza una base de datos PostgreSQL con Sequelize como ORM y sigue una arquitectura basada en el patrón MVC adaptado para APIs.

La lógica de negocio está implementada en controladores que gestionan las operaciones CRUD, mientras que los modelos en TypeScript definen la estructura de datos y las relaciones entre entidades. El proyecto está dockerizado y orquestado con Docker Compose junto con un frontend en React, una base de datos PostgreSQL, Redis para caché y Caddy como reverse proxy.

> **Nota:** Algunos archivos y funcionalidades se encuentran sin uso o incompletos porque serán completados y utilizados en una entrega posterior.

## Metodología de trabajo con Git y GitHub

El desarrollo del proyecto se llevó a cabo utilizando un flujo de trabajo colaborativo basado en ramas (Branching):

- **Rama main**: Contiene el código de producción estable y funcional.
- **Rama dev**: Rama principal de integración donde se unifica el trabajo en progreso.
- **Rama personal**: Cada integrante creó su propia rama derivada de dev para trabajar de forma ordenada.

- **Pull Requests (PR)**: Los cambios se integraron mediante PRs hacia dev, asegurando la revisión del código antes de fusionarlo.

## Tecnologías Utilizadas

- **Entorno de ejecución**: Node.js
- **Framework web**: Express.js
- **ORM**: Sequelize 6.x
- **Base de datos**: PostgreSQL 15
- **Lenguajes**: JavaScript y TypeScript (Modelos)
- **Contenedores**: Docker + Docker Compose

## Distribución de los archivos y carpetas

El backend está estructurado bajo el patrón MVC adaptado para APIs con Sequelize:

- **/controllers**: Contiene la lógica principal de negocio. Funciones asíncronas que interactúan con los modelos de Sequelize para realizar operaciones CRUD y consultas agregadas.
- **/models**: Definición de modelos usando Sequelize con TypeScript (User, Ejercicio, Rutina, Entrenamiento y sus tablas intermedias). Incluye interfaces y las relaciones (cardinalidades) entre entidades.
- **/routes**: Define los endpoints de la API y los asocia con sus respectivos middlewares y controladores.
- **/middleware**: Validaciones de entrada (POST y PUT) para asegurar la integridad de los datos antes de que lleguen a los controladores, más un manejador global de errores y el middleware de autenticación JWT.
- **/core**: Contiene la clase Server que inicializa la aplicación Express, conecta a la base de datos y registra los middlewares y rutas.
- **/docs**: Contiene diagramas UML y E-R, junto con un archivo md explicandolo.
- **/config**: Configuración de Sequelize para los entornos de desarrollo, test y producción.
- **/migrations**
- **/seeders**
- **/tests**
- **/utils**

## Migraciones y Seeders

El proyecto usa Sequelize CLI para crear y versionar la estructura de la base de datos mediante migraciones, y para cargar datos de prueba con seeders.

### Primera vez que clonen el proyecto (local)

1. Iniciar la base de datos:
   ```
   docker compose up -d database
   ```
2. Esperar a que la base de datos esté lista y levantar el backend:
   ```
   docker compose up -d backend
   ```
3. Ejecutar migraciones (crea las tablas):
   ```
   docker compose exec backend npm run migrate
   ```
4. Cargar datos de prueba:
   ```
   docker compose exec backend npm run seed
   ```
5. Levantar el resto de los servicios (frontend, caddy, etc.):
   ```
   docker compose up -d
   ```

### Comandos útiles

```
# Deshacer la última migración
docker compose exec backend npx sequelize-cli db:migrate:undo

# Ver estado de migraciones
docker compose exec backend npx sequelize-cli db:migrate:status

# Revertir todos los seeders
docker compose exec backend npx sequelize-cli db:seed:undo:all
```

> En Render + Neon las tablas ya existen, por lo que no es necesario ejecutar migraciones ni seeders.

## **Explicación de las Funciones**

### 1. Controladores

- **getAllEjercicios / getAllRutinas / getAllEntrenamientos**: Funciones asíncronas que utilizan los métodos estáticos de los modelos (ej. `EjercicioModel.findAllEjercicios()`) para obtener todos los registros de la tabla correspondiente. Retornan un array de objetos con estado HTTP 200.

- **getEjercicioById / getRutinaById / getEntrenamientoById**: Reciben un parámetro por la URL (req.params). Utilizan el método `findById()` del modelo correspondiente. Si no existe, retornan un error 404; si existe, devuelven el objeto incluyendo sus relaciones.

- **postNewEjercicio / postNewRutina / postNewEntrenamiento**: Reciben datos por el cuerpo de la petición (req.body). Crean el registro principal y, en el caso de rutinas y entrenamientos, también crean los registros en las tablas intermedias (rutina_ejercicios / entrenamiento_ejercicios) de forma atómica.

- **updateEjercicio / updateRutina**: Actualizan un registro existente. En el caso de rutinas, reemplazan completamente la lista de ejercicios asociados.

- **deleteEjercicio / deleteRutina / deleteEntrenamiento**: Eliminan un registro. Antes de eliminar, verifican integridad referencial (ej. no permitir eliminar un ejercicio que esté siendo usado en rutinas o entrenamientos, ni una rutina que tenga entrenamientos asociados).

- **getProgresoEjercicio**: Obtiene el historial de entrenamientos de un ejercicio específico (series, repeticiones, peso, fecha) realizando un join entre `EntrenamientoEjercicio` y `Entrenamiento`.

- **getEjerciciosByTipo**: Filtra ejercicios por su tipo (ej. "fuerza", "cardio", etc.).

- **getCountEjercicios**: Retorna la cantidad total de ejercicios registrados.

- **getEstadisticas**: Función que agrega estadísticas generales: total de entrenamientos, tiempo total de entrenamiento, duración promedio, ejercicio más frecuente (mediante SQL raw) y desglose mensual.

### 2. Modelos (Sequelize + TypeScript)

- **UserModel**: Define la tabla `users` con campos `id`, `nombre`, `email` y `password`. Incluye métodos para registro, login, validación de contraseña (bcrypt) y generación de tokens JWT. Relación 1:N con rutinas y entrenamientos.

- **EjercicioModel**: Define la tabla `ejercicios` con campos `id`, `nombre` y `tipo`. Métodos estáticos para CRUD y consultas específicas.

- **RutinaModel**: Define la tabla `rutinas` con campos `id`, `nombre`, `descripcion`, `duracion_minutos` y `user_id` (FK). Incluye en sus consultas los ejercicios asociados a través de la tabla intermedia y filtra por usuario autenticado.

- **RutinaEjercicioModel**: Modelo intermedio (junction) que relaciona rutinas con ejercicios, agregando campos como `orden`, `series`, `repeticiones` y `descanso_segundos`.

- **EntrenamientoModel**: Define la tabla `entrenamientos` con campos `id`, `rutina_id` (FK), `user_id` (FK), `fecha`, `duracion_real` y `notas`. Relacionado con ejercicios a través de la tabla intermedia y filtra por usuario autenticado.

- **EntrenamientoEjercicioModel**: Modelo intermedio que registra el desempeño real en cada ejercicio durante un entrenamiento: `series_realizadas`, `repeticiones_realizadas` y `peso_usado`.

### 3. Middlewares de Validación

- **validateInputEjercicios**: Verifica que `nombre` y `tipo` sean strings no vacíos.

- **validateInputRutinas**: Verifica que `nombre` sea un string no vacío y que `ejercicios` sea un array con al menos un elemento, cada uno con `ejercicio_id` numérico.

- **validateInputEntrenamiento**: Verifica `rutina_id` numérico, `fecha` parseable como fecha (opcional), `duracion_real` positivo (opcional), y `ejercicios` como array con al menos un elemento.

- **errorHandler**: Manejador global de errores. Captura `SequelizeValidationError` y retorna error 400 con detalles campo por campo. Para cualquier otro error, retorna 500.

## Base de Datos (PostgreSQL)

- Se trabajó con la base de datos en neon.

### Estructura de Tablas

| Tabla                        | Campos principales                                                                                               | Relaciones                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **users**                    | `id` (PK), `nombre`, `email`, `password`                                                                         | 1:M con rutinas, 1:M con entrenamientos                          |
| **ejercicios**               | `id` (PK), `nombre`, `tipo`                                                                                      | M:M con rutinas, M:M con entrenamientos                          |
| **rutinas**                  | `id` (PK), `nombre`, `descripcion`, `duracion_minutos`, `user_id` (FK)                                           | M:M con ejercicios, 1:M con entrenamientos, pertenece a usuario  |
| **rutina_ejercicios**        | `id`, `rutina_id` (FK), `ejercicio_id` (FK), `orden`, `series`, `repeticiones`, `descanso_segundos`              | Junction: pertenece a rutina y ejercicio                         |
| **entrenamientos**           | `id` (PK), `rutina_id` (FK), `user_id` (FK), `fecha`, `duracion_real`, `notas`                                   | Pertenece a rutina, M:M con ejercicios, pertenece a usuario      |
| **entrenamiento_ejercicios** | `id`, `entrenamiento_id` (FK), `ejercicio_id` (FK), `series_realizadas`, `repeticiones_realizadas`, `peso_usado` | Junction: pertenece a entrenamiento y ejercicio                  |

--- 

## Ejemplo de tablas en neon

- Tabla **ejercicios**:

<p align="center">
  <img src="frontend\src\assets\images\tabla_ejercicios.png" alt="Diagrama ER" width="1000">
</p>

- Tabla **entrenamientos**

<p align="center">
  <img src="frontend\src\assets\images\tabla_entrenamientos.png" alt="Diagrama ER" width="1000">
</p>

- Tabla **rutinas**

<p align="center">
  <img src="frontend\src\assets\images\tabla_rutinas.png" alt="Diagrama ER" width="1000">
</p>

## Autenticación y Autorización

La API utiliza **JWT (JSON Web Tokens)** para autenticación. Todos los endpoints protegidos requieren el header:

```
Authorization: Bearer <token>
```

**Flujo de autenticación:**

1. **Registro** → `POST /api/auth/register` → crea usuario y devuelve token
2. **Login** → `POST /api/auth/login` → valida credenciales y devuelve token
3. **Perfil** → `GET /api/auth/perfil` → obtiene datos del usuario autenticado
4. Usar el token en los headers de las peticiones a recursos protegidos

**Aislamiento por usuario:** Cada usuario autenticado ve y opera solo sobre sus propias rutinas y entrenamientos. Un usuario no puede acceder a recursos de otro.

## Endpoints de la API

### **Autenticación (/api/auth)**

| Método | Ruta                   | Descripción                                      | Requiere Auth |
| ------ | ---------------------- | ------------------------------------------------ | ------------- |
| `POST` | `/api/auth/register`   | Registra un nuevo usuario (nombre, email, password) | No          |
| `POST` | `/api/auth/login`      | Inicia sesión y devuelve token JWT               | No          |
| `GET`  | `/api/auth/perfil`     | Obtiene datos del usuario autenticado            | Sí           |
| `GET`  | `/api/auth/usuarios`   | Lista todos los usuarios                         | No           |

### **Ejercicios (/api/ejercicios)**

| Método   | Ruta                           | Descripción                                         | Requiere Auth |
| -------- | ------------------------------ | --------------------------------------------------- | ------------- |
| `GET`    | `/api/ejercicios`              | Lista completa de ejercicios                        | Sí            |
| `GET`    | `/api/ejercicios/count`        | Cantidad total de ejercicios                        | Sí            |
| `GET`    | `/api/ejercicios/tipo/:tipo`   | Ejercicios filtrados por tipo                       | Sí            |
| `GET`    | `/api/ejercicios/:id`          | Detalle de un ejercicio                             | Sí            |
| `GET`    | `/api/ejercicios/:id/progreso` | Historial de progreso de un ejercicio               | Sí            |
| `POST`   | `/api/ejercicios`              | Crea un nuevo ejercicio (Requiere: nombre, tipo)    | Sí            |
| `PUT`    | `/api/ejercicios/:id`          | Modifica un ejercicio existente                     | Sí            |
| `DELETE` | `/api/ejercicios/:id`          | Elimina un ejercicio (solo si no está referenciado) | Sí            |

### **Rutinas (/api/rutinas)**

| Método   | Ruta               | Descripción                                                           | Requiere Auth |
| -------- | ------------------ | --------------------------------------------------------------------- | ------------- |
| `GET`    | `/api/rutinas`     | Lista de rutinas del usuario autenticado (con ejercicios asociados)   | Sí            |
| `GET`    | `/api/rutinas/:id` | Detalle de una rutina (con ejercicios asociados)                      | Sí            |
| `POST`   | `/api/rutinas`     | Crea una nueva rutina con ejercicios (Requiere: nombre, ejercicios[]) | Sí            |
| `PUT`    | `/api/rutinas/:id` | Modifica una rutina y reemplaza sus ejercicios                        | Sí            |
| `DELETE` | `/api/rutinas/:id` | Elimina una rutina (solo si no tiene entrenamientos asociados)        | Sí            |

### **Entrenamientos (/api/entrenamientos)**

| Método   | Ruta                      | Descripción                                                         | Requiere Auth |
| -------- | ------------------------- | ------------------------------------------------------------------- | ------------- |
| `GET`    | `/api/entrenamientos`     | Lista de entrenamientos del usuario autenticado                     | Sí            |
| `GET`    | `/api/entrenamientos/:id` | Detalle de un entrenamiento                                         | Sí            |
| `POST`   | `/api/entrenamientos`     | Registra un nuevo entrenamiento (Requiere: rutina_id, ejercicios[]) | Sí            |
| `DELETE` | `/api/entrenamientos/:id` | Elimina un entrenamiento                                            | Sí            |

### **Estadísticas (/api/estadisticas)**

| Método | Ruta                | Descripción                                                                            | Requiere Auth |
| ------ | ------------------- | -------------------------------------------------------------------------------------- | ------------- |
| `GET`  | `/api/estadisticas` | Estadísticas del usuario autenticado (totales, promedios, ejercicio más frecuente, desglose mensual) | Sí            |

## **Validaciones y Manejo de Errores**

El proyecto cuenta con middlewares específicos para cada entidad que interceptan las peticiones y verifican:

- Presencia de campos obligatorios.
- Tipos de datos correctos (strings, numbers).
- Formatos válidos y rangos lógicos (series, repeticiones, descanso).
- Integridad referencial antes de eliminaciones.
- En caso de enviar datos inválidos o intentar acceder a recursos inexistentes, la API responde con los códigos de estado HTTP correspondientes (400 Bad Request, 404 Not Found, 409 Conflict, 500 Internal Server Error).

## **Link de render**

https://tp-final-grupo10.onrender.com

## **Link de documentación de postman**

https://documenter.getpostman.com/view/55293974/2sBXwsMq5G
