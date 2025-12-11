# Clinex — Backend (Node.js, TypeScript, Clean Architecture)

### Descripción breve  
Clinex es el backend de una aplicación de gestión clínica. Está escrito en TypeScript sobre Node.js y Express, estructurado siguiendo principios de Clean Architecture para mantener una clara separación entre dominio, casos de uso y detalles de infraestructura (persistencia, frameworks). El repo está diseñado para facilitar mantenimiento, pruebas unitarias y reemplazo de implementaciones de persistencia (MongoDB / MySQL).

---

## Qué problema resuelve
Provee una API backend organizada para gestionar entidades clínicas básicas (pacientes y médicos), con validación de entrada, manejo estructurado de errores y abstracción de persistencia. Sirve como base técnica para sistemas de gestión de turnos, historiales o directorios médicos.

---

## Funcionalidades principales
- Endpoints agrupados para recursos clínicos:
  - `/api/patients` — operaciones sobre pacientes
  - `/api/doctors` — operaciones sobre médicos
- DTOs y validación de request payloads (ej.: `DoctorDTO`, `CreatePatientDTO`, `UpdatePatientDTO`)
- Entidades del dominio (ej.: `Patient`)
- Casos de uso (use-cases) que implementan la lógica de negocio (create, read, update, delete)
- Repositorios e implementaciones de datasource (Mongo / MySQL) que separan la lógica de acceso a datos del dominio
- Middlewares globales para envoltorio de respuestas y manejo centralizado de errores
- Archivos para inicialización de bases de datos (`mongo.init.ts`, `mysql.init`) y orquestador de arranque (`src/app.ts`)

---

## Contexto del dominio
Dominio clínico modelado (resumen):
- Pacientes: entidad `Patient` con campos como dni, firstName, lastName, birthDate, email, sex e id.
- Médicos: DTOs y tipos para nombre, especialidad, email y teléfono.
- Casos de uso presentes para crear, leer (por ID y por DNI), actualizar y eliminar pacientes.

---

## Tecnologías principales y su rol

- Node.js + TypeScript  
  Plataforma y tipado estático para robustez y mantenimiento.

- Express  
  Framework HTTP que gestiona rutas, middlewares y ciclo de vida del servidor.

- MongoDB (Mongoose)  
  Persistencia orientada a documentos. El repo contiene inicializadores y modelos Mongoose (abstraídos por datasources).

- MySQL  
  El proyecto incluye inicializador MySQL; la arquitectura permite alternar o sumar almacenes.

- Clean Architecture  
  Separación clara entre capas: dominio (entidades, DTOs), casos de uso (lógica), infraestructura (repositorios/datasources) y presentación (controllers/routes). Facilita pruebas unitarias y cambios de infra sin tocar la lógica.

- Librerías destacadas
  - env-var + dotenv: validación y carga de variables de entorno (`src/config/plugins/envs.plugin.ts`)
  - jest: configuración de pruebas (`jest.config.js`)
  - mongoose: conexión con MongoDB (`src/data/mongo/mongo.init.ts`)

---

## Organización del repositorio y responsabilidad de cada capa

Estructura (resumen):
- src/
  - config/ — plugins y validación de envs
  - data/
    - mongo/ — inicializador y modelos Mongoose
    - mysql/ — inicializador MySQL
  - domain/
    - entities/ — modelos de dominio puros (ej.: `Patient`)
    - dtos/ — validadores/transformadores de entrada (ej.: `DoctorDTO`, `CreatePatientDTO`)
    - types/ — tipos reutilizables
    - errors/ — definición de errores de dominio (`CustomError`)
    - usecases/ — casos de uso que orquestan la lógica de negocio
    - interfaces/ — contratos que definen los repositorios esperados por el dominio
  - infrastructure/
    - datasources/ — adaptadores concretos a la BD (ej.: `MongoPatientDatasource`)
    - repositories/ — implementaciones que satisfacen las interfaces de repositorio (ej.: `PatientRepoImplementation`)
  - presentation/
    - server.ts — configuración y arranque de Express
    - routes.ts — registro de rutas globales y middlewares
    - patient/ — rutas y controller de pacientes (`patient.routes.ts`, `patient.controller.ts`)
    - doctor/ — rutas y controller de médicos (DTOs y tipos disponibles)
    - middlewares/ — `responseEnvelope`, `errorHandler`, etc.
  - app.ts — punto de orquestación: conecta BD, instancia repositorios/usecases y arranca Server

Responsabilidades:
- Dominio: definir entidades, invariantes, DTOs y errores.
- Casos de uso: implementar las reglas de negocio y orquestar repositorios.
- Infraestructura: acceder a la base de datos y mapear entre modelos de persistencia y entidades del dominio.
- Presentación: exponer la API HTTP y aplicar validaciones/transformaciones necesarias antes de invocar casos de uso.

Patrón repositorio y abstracción de Mongoose  
Los use-cases dependen de interfaces de repositorio (contratos). Las implementaciones concretas (ej.: `PatientRepoImplementation`) reciben un datasource concreto (ej.: `MongoPatientDatasource`) que usa Mongoose. Así, el dominio no importa detalles de Mongoose ni de SQL; solo llama a métodos del repositorio.

Diagrama ASCII simplificado de flujo
```
[Client] --> [Express Routes / Controller]
              --> [Use Case] 
                   --> [Repository Interface] 
                        --> [Repository Implementation]
                             --> [Datasource (Mongoose / MySQL driver)]
                                  --> [Database (MongoDB / MySQL)]
```

---

## Instalación y configuración

Requisitos
- Node.js (preferible >= 14)
- npm
- Docker (opcional)

Variables de entorno (definidas y requeridas en `src/config/plugins/envs.plugin.ts`):
- PORT (ej.: 3000)
- PROD (ej.: "true" | "false")
- MONGO_URL (ej.: mongodb://localhost:27017)
- MONGO_DB_NAME
- MONGO_USER
- MONGO_PASSWORD
- MYSQL_HOST
- MYSQL_PORT
- MYSQL_USER
- MYSQL_PASSWORD
- MYSQL_DATABASE

Ejemplo básico de .env (valores de ejemplo)
```
PORT=3000
PROD=false

MONGO_URL=mongodb://localhost:27017
MONGO_DB_NAME=clinex
MONGO_USER=
MONGO_PASSWORD=

MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=secret
MYSQL_DATABASE=clinex
```

Instalación y ejecución
1. Clonar:
   - git clone https://github.com/candiath/clinex.git
2. Instalar dependencias:
   - npm install
3. Ejecutar (modo desarrollo):
   - npx ts-node src/app.ts
   - o compilar: npx tsc && node dist/src/app.js
4. Con Docker (si se usan los compose incluidos):
   - docker-compose up -d
   - o docker-compose -f docker-compose.mysql.yml up -d

Nota importante: en `src/app.ts` la conexión a MongoDB aparece comentada y actualmente se invoca `MySQLDatabase.connect()`. Ajustar según la BD que se quiera usar.

---

## Uso del proyecto (API) — ejemplos concretos

A continuación se muestran ejemplos concretos extraídos del código de rutas y del controller de pacientes. Estos ejemplos utilizan las rutas registradas en `src/presentation/routes.ts` y la lógica observada en `src/presentation/patient`.

Rutas principales observadas (presentación)
- GET /test  
  - Endpoint de prueba.
- Ruta de pacientes: prefijo `/api/patients` (definido en `PatientRoutes`)
- Ruta de médicos: prefijo `/api/doctors` (definido en `DoctorRoutes`)
- Raíz `/` → 404 JSON

Endpoints esenciales para pacientes (implementación observada en `patient.routes.ts` y `patient.controller.ts`):

1) Crear paciente
- Método: POST
- URL: /api/patients
- Request (application/json)
  ```
  {
    "dni": "12345678A",
    "firstName": "Juan",
    "lastName": "Pérez",
    "birthDate": "1990-01-01",
    "email": "juan.perez@example.com",
    "sex": "male"
  }
  ```
- Respuesta exitosa (201 Created)
  ```
  {
    "id": "60f7b2d3a8e4f5d1c2b3a4e5",
    "dni": "12345678A",
    "firstName": "Juan",
    "lastName": "Pérez",
    "birthDate": "1990-01-01T00:00:00.000Z",
    "email": "juan.perez@example.com",
    "sex": "male"
  }
  ```
- Errores típicos:
  - 400 Bad Request: cuerpo vacío o validación fallida
  - 501 Internal Server Error: errores no esperados

2) Obtener todos los pacientes
- Método: GET
- URL: /api/patients
- Respuesta (200 OK): lista de pacientes (sanitizados con `PublicPatientDTO`)
  ```
  [
    {
      "id": "60f7b2d3a8e4f5d1c2b3a4e5",
      "dni": "12345678A",
      "name": "Juan",
      "surname": "Pérez",
      "birthDate": "1990-01-01T00:00:00.000Z",
      "email": "juan.perez@example.com"
    },
    ...
  ]
  ```

3) Obtener paciente por DNI (query param)
- Método: GET
- URL: /api/patients?dni=12345678A
- Respuesta (200 OK): paciente individual (mapeado con `PublicPatientDTO`)
  ```
  {
    "id": "60f7b2d3a8e4f5d1c2b3a4e5",
    "dni": "12345678A",
    "name": "Juan",
    "surname": "Pérez",
    "birthDate": "1990-01-01T00:00:00.000Z",
    "email": "juan.perez@example.com"
  }
  ```
- Respuesta si no existe: 400 o 404 con mensaje descriptivo

4) Obtener paciente por ID
- Método: GET
- URL: /api/patients/:id
- Comportamiento observado:
  - Se valida que `id` sea un ObjectId válido (mongoose.Types.ObjectId)
  - Si válido y existe → 200 + paciente
  - Si inválido → 400 Bad Request

5) Actualizar paciente por ID
- Método: PUT
- URL: /api/patients/:id
- Request (application/json): campos a actualizar (ejemplo)
  ```
  {
    "firstName": "Juan Carlos",
    "email": "juan.carlos@example.com"
  }
  ```
- Respuestas:
  - 200 OK → { message: "Patient updated successfully" }
  - 400 Bad Request → cuerpo vacío o formato inválido
  - 404 Not Found → paciente no encontrado

6) Eliminar paciente por DNI
- Método: DELETE
- URL: /api/patients/:dni
- Respuestas:
  - 204 No Content → eliminado correctamente (controller envía 204 con mensaje)
  - 400 Bad Request → falta DNI o formato inválido

Notas sobre comportamiento observado en controller:
- GET no acepta body; si se recibe body en GET retorna 400.
- Validaciones y errores encapsulados con `CustomError` y manejados por middleware global.
- Las respuestas públicas se construyen mediante DTOs (ej.: `PublicPatientDTO.fromPatient`).

Ejemplos para médicos (basados en `DoctorDTO`)
- Se ha detectado `DoctorDTO` con validación de campos: name, specialty (valores validados por `ValidationHelper`), email, phone e id.
- En el repo existe `DoctorRoutes` registrado en `routes.ts`. Si bien la implementación concreta de rutas de médicos no fue inspeccionada línea por línea, el DTO muestra el esquema y la intención de operaciones CRUD. Ejemplo de payload para crear/actualizar médico:
  ```
  {
    "name": "Dra. María Gómez",
    "specialty": "cardiology",
    "email": "maria.gomez@example.com",
    "phone": "+5491123456789"
  }
  ```
- Se recomienda revisar `src/presentation/doctor` para confirmar métodos exactos (POST/GET/PUT/DELETE) y respuestas concretas.

---

## Testing

- Jest está configurado (`jest.config.js` existe en el repo).
- Se espera que los tests se estructuren por capas (unit tests para DTOs y use-cases; tests para adaptadores/repositorios).
- Comandos habituales:
  - Ejecutar tests: npm test
  - Ejecutar jest directamente: npx jest --config jest.config.js
- Recomendación observada: crear tests unitarios para use-cases (son fácilmente testeables por estar desacoplados de Express y Mongoose).

---

## Manejo de errores, validación y convenciones
- `CustomError` centraliza códigos HTTP, mensajes, detalles y permite construir respuestas consistentes (ej.: badRequest, notFound, conflict).
- DTOs validan formato y tipos antes de crear entidades o invocar use-cases (separación entre validación de entrada y lógica de negocio).
- Middlewares:
  - `responseEnvelope` envuelve respuestas de manera consistente.
  - `errorHandler` captura errores no manejados y los transforma en respuestas HTTP.
- Inyección de dependencias:
  - No se usa un contenedor DI externo; la inyección se hace manualmente en `app.ts` y en los controllers (instanciando repositorios con datasources concretos). Esto mantiene la inversión de dependencias sin añadir complejidad de contenedor.

---

## Decisiones técnicas (resumen y justificación)
- Clean Architecture se eligió para mantener independencia del dominio frente a frameworks y persistencia; facilita tests unitarios y cambios de infra.
- DTOs para validación clara y reutilizable de payloads.
- Repositorio + datasource para aislar Mongoose/SQL del dominio.
- Validación de entorno en arranque (env-var) para fallar temprano si faltan variables esenciales.

---

## Roadmap / mejoras recomendadas
- Añadir tests de integración que levanten BD (Mongo/MySQL) para validar flujos end-to-end.
- Publicar documentación de API (OpenAPI/Swagger).
- Añadir CI (GitHub Actions) para ejecutar lint, build y tests en cada PR.
- Añadir scripts npm estándar (`dev`, `build`, `start`, `test`) si faltan.
- Añadir ejemplos de seed y scripts para entorno local reproducible.
- Mejorar mensajes de error y códigos devueltos (uniformidad 4xx vs 5xx).

---

## Licencia
No se detectó un archivo `LICENSE` en el repo analizado. Añadir un archivo LICENSE (ej. MIT) si desea aclarar términos de uso.

---

## Archivos clave (puntos de interés para revisión técnica)
- src/app.ts — orquestador de arranque
- src/presentation/server.ts — servidor Express
- src/presentation/routes.ts — registro de rutas y middlewares
- src/presentation/patient/patient.routes.ts — rutas de pacientes
- src/presentation/patient/patient.controller.ts — controlador y mapping a use-cases
- src/domain/ — entidades, DTOs, tipos y `CustomError`
- src/infrastructure/ — datasources y repositorios
- src/data/mongo/mongo.init.ts — inicializador de MongoDB
- docker-compose.yml / docker-compose.mysql.yml — composiciones disponibles
- jest.config.js — configuración de pruebas
