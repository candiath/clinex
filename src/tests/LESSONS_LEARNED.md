# 🎯 Integration Testing - Lecciones Aprendidas

## EntityID Serialization

El `EntityID` value object puede serializarse de diferentes formas según el contexto:
- Como número primitivo: `8`
- Como objeto con `value`: `{value: 8}`
- Como objeto con `id`: `{id: 8}`

**Solución:** Extracción flexible en assertions:
```typescript
const receivedId = response.body.data.id?.id || response.body.data.id?.value || response.body.data.id;
expect(receivedId).toBe(expectedId);
```

## Orden de Middlewares en Express

El orden de middlewares es **CRÍTICO**. Un orden incorrecto causa 404s silenciosos:

```typescript
// ✅ ORDEN CORRECTO:
router.use('/api/doctors', DoctorRoutes.routes);  // Rutas específicas PRIMERO
router.use(responseEnvelope);                     // Wrappers de respuesta
router.use(errorHandler);                         // Manejadores de errores
router.use('/', notFoundHandler);                 // Catch-all 404 AL FINAL

// ❌ INCORRECTO: Catch-all antes de los middlewares bloquea todo
```

**Problema encontrado:** Cuando el catch-all 404 se colocó antes de `responseEnvelope` y `errorHandler`, todas las rutas válidas devolvían 404 porque el catch-all las interceptaba primero.

## Server Configuration para Testing

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

**Por qué:** Supertest necesita el app configurado antes de crear el HTTP server. Si los middlewares se configuran en `start()`, supertest obtiene un app sin configurar.

## Duplicate Middleware Registration

Registrar el mismo middleware en múltiples lugares causa comportamientos impredecibles:

```typescript
// ❌ INCORRECTO:
// En AppRoutes (routes.ts):
router.use(responseEnvelope);

// También en DoctorRoutes (doctor.routes.ts):
router.use(responseEnvelope);  // DUPLICADO
```

**Problema encontrado:** El middleware `responseEnvelope` registrado dos veces causaba que las rutas se bloquearan antes de llegar a los handlers.

**Solución:** Registrar middlewares globales solo en `AppRoutes`, nunca en rutas específicas.

## TestDataFactory - Unique Constraints

Al trabajar con bases de datos reales, los unique constraints requieren cuidado:

```typescript
// ❌ PROBLEMA: Email duplicado
const doctor1 = TestDataFactory.createValidDoctor();
const doctor2 = TestDataFactory.createValidDoctor();
// Ambos tendrían el mismo email → Error de duplicado

// ✅ SOLUCIÓN: Generador de emails únicos
private static emailCounter = 0;

static generateUniqueEmail(): string {
  return `test${this.emailCounter++}@example.com`;
}
```

**Lección:** Siempre usa contadores o timestamps para generar datos únicos en factories de test.

## Database Management Strategy

**Decisión tomada:** No hacer cleanup automático por test (teardown), sino manual cuando sea necesario.

**Pros:**
- Tests más rápidos (no hay overhead de truncate/reset entre tests)
- Datos acumulativos pueden ser útiles para debugging
- Menos queries a la DB

**Cons:**
- Tests no completamente aislados
- Posibles interferencias si hay dependencias entre tests

**Para este proyecto:** Los tests están diseñados para no depender del estado previo de la DB, usando factories para generar datos únicos.

## Error Handling - CustomError Integration

Los errores del dominio (`CustomError`) se capturan correctamente por el middleware `errorHandler`:

```typescript
// En el test:
expect(response.status).toBe(400);
expect(response.body.success).toBe(false);
expect(response.body.error.code).toBe('BAD_REQUEST');
```

**Lección:** El middleware de error handling funciona correctamente en el entorno de test gracias a que está configurado en el constructor del Server.

## MySQL Pool Connection in Tests

La conexión a MySQL usa un pool compartido (`MySQLDatabase.pool`):
- **Conexión:** Se establece una vez al inicio de la suite
- **Desconexión:** Se cierra al final de la suite
- **No se reinicia** entre tests individuales

**Beneficio:** Reduce overhead de conexión/desconexión constante.

## Summary

Las principales barreras para lograr 18/18 tests pasando fueron:

1. **Middleware ordering** - Orden crítico de middlewares
2. **Server configuration timing** - Configurar middlewares en constructor
3. **Duplicate middleware** - No duplicar registros
4. **EntityID serialization** - Manejo flexible de formatos
5. **Unique data generation** - Factories con contadores

Estos patterns se pueden replicar directamente para Patient y Appointment entities.
