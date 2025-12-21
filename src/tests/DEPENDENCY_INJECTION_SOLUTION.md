# Solución: Inyección de Configuración para MySQLDatabase

## Problema Identificado

Los tests estaban usando las variables de entorno de **producción/desarrollo** porque `MySQLDatabase` importaba directamente `envs.plugin`, sin distinguir entre entornos.

```typescript
// ❌ PROBLEMA ANTERIOR:
import { envs } from '../../config/plugins/envs.plugin';

export class MySQLDatabase {
  static async connect(): Promise<void> {
    this.pool = mysql.createPool({
      host: envs.MYSQL_HOST,  // Siempre usa .env principal
      // ...
    });
  }
}
```

**Riesgo crítico:** Los tests podían correr contra la base de datos de desarrollo/producción, causando:
- Pérdida de datos
- Tests que modifican datos reales
- Falsos positivos/negativos por estado inconsistente

## Solución Implementada: Dependency Injection Pattern

### 1. Interfaz de Configuración

```typescript
export interface MySQLConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  waitForConnections?: boolean;
  connectionLimit?: number;
  queueLimit?: number;
  connectTimeout?: number;
}
```

### 2. Inyección de Configuración en MySQLDatabase

```typescript
export class MySQLDatabase {
  static pool: mysql.Pool;
  private static config: MySQLConfig | null = null;

  /**
   * Set configuration before connecting
   * Useful for testing with different database settings
   */
  static setConfig(config: MySQLConfig): void {
    this.config = config;
  }

  /**
   * Get current configuration
   * Falls back to envs.plugin if no config was explicitly set
   */
  private static getConfig(): MySQLConfig {
    if (this.config) {
      return this.config;  // Configuración inyectada (tests)
    }
    
    // Fallback para backward compatibility (producción)
    return {
      host: envs.MYSQL_HOST,
      port: envs.MYSQL_PORT,
      // ...
    };
  }

  static async connect(): Promise<void> {
    const config = this.getConfig();  // Usa config inyectada o fallback
    this.pool = mysql.createPool(config);
    // ...
  }
}
```

### 3. Test Helper con Configuración Explícita

```typescript
export class TestDatabaseHelper {
  /**
   * Get test database configuration
   * Reads from process.env loaded by Jest setup
   */
  private static getTestConfig(): MySQLConfig {
    return {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3307', 10),
      user: process.env.MYSQL_USER || 'test_user',
      password: process.env.MYSQL_PASSWORD || 'test_password',
      database: process.env.MYSQL_DATABASE || 'clinex_test',
      connectionLimit: 5,  // Lower for tests
      connectTimeout: 10000,  // Shorter timeout
    };
  }

  static async connect(): Promise<void> {
    // ✅ Inyecta configuración de test ANTES de conectar
    const testConfig = this.getTestConfig();
    MySQLDatabase.setConfig(testConfig);
    
    await MySQLDatabase.connect();
    // ...
  }
}
```

### 4. Jest Setup para Cargar .env.test

**Archivo:** `src/tests/setup.ts`

```typescript
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carga .env.test antes de cualquier test
const envTestPath = path.resolve(__dirname, '../../.env.test');
dotenv.config({ path: envTestPath });
```

**Configuración:** `jest.config.js`

```javascript
module.exports = {
  testEnvironment: "node",
  setupFiles: ['<rootDir>/src/tests/setup.ts'],  // ⬅️ Carga setup
  // ...
};
```

## Ventajas del Patrón Implementado

### ✅ Separación de Concerns
- MySQLDatabase ya no depende de `envs.plugin` directamente
- Configuración inyectada desde el exterior
- Testeable sin side effects

### ✅ Backward Compatibility
- Código de producción sigue funcionando (usa fallback)
- No se requieren cambios en datasources o repositorios existentes
- Migración gradual posible

### ✅ Flexibilidad
- Múltiples configuraciones simultáneas (dev, test, integration)
- Fácil cambiar configuración entre tests
- Reset() method para limpiar estado

### ✅ Explicit > Implicit
- Tests declaran explícitamente qué configuración usan
- No hay magia oculta ni variables globales
- Código autodocumentado

## Comparación con Alternativas

### ❌ Alternativa 1: NODE_ENV Detection

```typescript
// NO RECOMENDADO
static getConfig(): MySQLConfig {
  if (process.env.NODE_ENV === 'test') {
    return testConfig;
  }
  return productionConfig;
}
```

**Problemas:**
- Acoplamiento a NODE_ENV
- Difícil tener múltiples configuraciones de test
- Lógica condicional dentro de infraestructura

### ❌ Alternativa 2: Subclasses

```typescript
// NO RECOMENDADO
class TestMySQLDatabase extends MySQLDatabase {
  // Override config...
}
```

**Problemas:**
- Duplicación de código
- Difícil mantener dos clases
- Rompe singleton pattern

### ✅ Nuestra Solución: Dependency Injection

**Por qué es mejor:**
- ✅ Single Responsibility (MySQLDatabase solo maneja conexión)
- ✅ Open/Closed (abierto para extensión, cerrado para modificación)
- ✅ Dependency Inversion (depende de abstracción MySQLConfig)
- ✅ Testable (configuración inyectable)

## Flujo de Ejecución

### Producción

```
app.ts
  ↓
MySQLDatabase.connect()
  ↓
getConfig() → envs.plugin (fallback)
  ↓
createPool({ host: envs.MYSQL_HOST, database: "clinex", ... })
```

### Tests

```
doctor.api.test.ts
  ↓
beforeAll:
  TestDatabaseHelper.connect()
    ↓
    MySQLDatabase.setConfig({ database: "clinex_test", port: 3307 })
    ↓
    MySQLDatabase.connect()
      ↓
      getConfig() → config inyectada
      ↓
      createPool({ host: "localhost", database: "clinex_test", port: 3307 })
```

## Verificación de la Solución

**Antes:**
```bash
npm run test:integration
# ❌ Riesgo: podría usar DB de desarrollo
```

**Después:**
```bash
npm run test:integration
# ✅ Garantizado: usa clinex_test en puerto 3307
# Configuración inyectada explícitamente en TestDatabaseHelper
```

## Próximos Pasos

1. **Documentar en código de producción** que MySQLDatabase.connect() usa envs.plugin por defecto
2. **Agregar logs** en desarrollo para confirmar qué DB se está usando:
   ```typescript
   console.log(`Connected to: ${config.database}@${config.host}:${config.port}`);
   ```
3. **Considerar** aplicar mismo patrón a otros recursos (MongoDB, Redis, etc.)

## Lección de Arquitectura

> **Principio:** "Inyecta dependencias, no las importes estáticamente"

Cuando una clase necesita configuración que varía según el entorno:
- ❌ NO: `import { config } from './config'`
- ✅ SÍ: Pasar configuración como parámetro o método setter

Esto hace el código:
- Más testeable
- Más flexible
- Más mantenible
- Más explícito sobre sus dependencias
