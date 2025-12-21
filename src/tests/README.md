# Integration Testing - Doctor API

## 📋 Prerequisitos

1. **Docker Desktop** instalado y corriendo
2. **Node.js** y dependencias instaladas (`npm install`)

## 🚀 Cómo Ejecutar los Tests

### 1. Levantar la Base de Datos de Test

```bash
npm run docker:test:up
```

Esto levanta un contenedor MySQL en el puerto **3307** (diferente al dev que usa 3306).

**Verificar que está listo:**
```bash
npm run docker:test:logs
```

Espera a ver: `ready for connections` en los logs.

### 2. Ejecutar los Tests de Integración

```bash
npm run test:integration
```

### 3. Ver tests en modo watch (desarrollo)

```bash
npm run test:integration:watch
```

### 4. Bajar la BD cuando termines

```bash
npm run docker:test:down
```

## 📂 Estructura de Tests

```
src/tests/
├── integration/
│   └── doctor.api.test.ts          # Tests API completos
├── helpers/
│   ├── testDatabase.helper.ts      # Helpers para BD
│   ├── testServer.helper.ts        # Helpers para servidor
│   └── testData.factory.ts         # Factory de datos de test
```

## 🧪 Tests Implementados

### POST /api/doctors (Create)
- ✅ Crear doctor válido
- ❌ Error con datos faltantes
- ❌ Error con email inválido
- ❌ Error con specialty inválida

### GET /api/doctors/:id (Read by ID)
- ✅ Obtener doctor existente
- ❌ Doctor no encontrado (404)
- ❌ ID inválido (400)

### GET /api/doctors (Read All)
- ✅ Obtener todos los doctores
- ✅ Array vacío cuando no hay doctores

### PUT /api/doctors/:id (Update)
- ✅ Actualizar doctor completo
- ✅ Actualización parcial
- ❌ Doctor no encontrado (404)
- ❌ Datos inválidos (400)

### DELETE /api/doctors/:id (Delete)
- ✅ Eliminar doctor existente
- ❌ Doctor no encontrado (404)
- ❌ ID inválido (400)

## 🔧 Configuración

### Variables de Entorno (.env.test)
```env
PORT=0
NODE_ENV=test
MYSQL_HOST=localhost
MYSQL_PORT=3307
MYSQL_DATABASE=clinex_test
MYSQL_USER=test_user
MYSQL_PASSWORD=test_password
```

### Docker Compose (docker-compose.test.yml)
- **Imagen:** MySQL 8.0
- **Puerto:** 3307 (host) → 3306 (container)
- **Base de datos:** clinex_test
- **Volúmenes:** Sin persistencia (se destruye al bajar)

## 📝 Notas Importantes

1. **Tests no son destructivos:** Los datos se acumulan entre tests para evitar overhead de setup/teardown continuo.

2. **Emails únicos:** El TestDataFactory genera emails únicos para evitar conflictos de duplicados.

3. **Independencia:** Los tests de integración son independientes de los unit tests. Puedes ejecutarlos por separado:
   - Unit tests: `npm run test:unit`
   - Integration tests: `npm run test:integration`
   - Todos: `npm run test:all`

4. **Troubleshooting:**
   - Si los tests fallan por conexión, verifica que el container esté ready con `npm run docker:test:logs`
   - Si hay conflictos de puerto, cambia el 3307 en docker-compose.test.yml y .env.test
   - Para limpiar todo: `npm run docker:test:down` y vuelve a empezar

## 🎓 Aprendizaje para Implementar Patient y Appointment

Usa este código como template para:
1. Crear `patient.api.test.ts` y `appointment.api.test.ts`
2. Reutilizar los helpers (solo necesitas nuevos factories)
3. Seguir el mismo patrón de describe/it
4. Mantener consistencia en las aserciones

## 🚨 Antes de Hacer Commit

```bash
# Ejecuta todos los tests
npm run test:all

# Verifica lint
npm run lint

# Si todo pasa, estás listo para commit
```
## 🎯 Lecciones Aprendidas (Technical Insights)

### EntityID Serialization
El EntityID value object puede serializarse de diferentes formas según el contexto:
- Como número primitivo: `8`
- Como objeto con `value`: `{value: 8}`
- Como objeto con `id`: `{id: 8}`

**Solución:** Extracción flexible en assertions:
```typescript
const receivedId = response.body.data.id?.id || response.body.data.id?.value || response.body.data.id;
expect(receivedId).toBe(expectedId);
```

### Orden de Middlewares en Express
El orden de middlewares es **CRÍTICO**. Un orden incorrecto causa 404s silenciosos:

```typescript
// ✅ ORDEN CORRECTO:
router.use('/api/doctors', DoctorRoutes.routes);  // Rutas específicas PRIMERO
router.use(responseEnvelope);                     // Wrappers de respuesta
router.use(errorHandler);                         // Manejadores de errores
router.use('/', notFoundHandler);                 // Catch-all 404 AL FINAL

// ❌ INCORRECTO: Catch-all antes de los middlewares bloquea todo
```

### Server Configuration para Testing
Los middlewares deben configurarse en el **constructor**, NO en `start()`:

```typescript
// ✅ CORRECTO:
constructor() {
  this.app.use(express.json());         // Aquí
  this.app.use(express.urlencoded());   // Aquí
  this.app.use(this.routes);            // Aquí
}

// ❌ INCORRECTO:
async start() {
  this.app.use(express.json());  // Supertest no tendrá estos middlewares
  ...
}
```

**Por qué:** Supertest necesita el app configurado antes de crear el HTTP server.

### Duplicate Middleware Registration
Registrar el mismo middleware en múltiples lugares causa comportamientos impredecibles:
- Si `responseEnvelope` está en `AppRoutes` (global), NO lo registres en `DoctorRoutes`
- Esto causaba que las rutas se bloquearan antes de llegar a los handlers
