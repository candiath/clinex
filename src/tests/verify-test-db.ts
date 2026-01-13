/**
 * Script to verify which database the tests are using
 * Run: `npx ts-node src/tests/verify-test-db.ts`
 */
// ⚠️ CRITICAL: Load .env.test BEFORE importing anything
import * as dotenv from 'dotenv';
import * as path from 'path';

const envTestPath = path.resolve(__dirname, '../../.env.test');
const result = dotenv.config({ path: envTestPath, override: true });

if (result.error) {
  console.error('❌ Error loading .env.test:', result.error);
  process.exit(1);
}

// console.log('✅ Loaded .env.test from:', envTestPath);
// console.log('   MYSQL_DATABASE:', process.env.MYSQL_DATABASE);
// console.log('   MYSQL_PORT:', process.env.MYSQL_PORT);
// console.log('');
import { TestDatabaseHelper } from "./helpers/testDatabase.helper";

async function verifyTestDatabase() {
  try {
    console.log("\n🔍 Verificando configuración de base de datos de tests...\n");

    // Connect using test configuration
    await TestDatabaseHelper.connect();

    // Check doctor count
    const count = await TestDatabaseHelper.getDoctorCount();
    console.log(`📊 Doctores en la base de datos: ${count}`);

    // Disconnect
    await TestDatabaseHelper.disconnect();

    console.log("\n✅ Verificación completada exitosamente");
    // console.log("Si viste 'clinex_test @ localhost:3307', estás usando la DB correcta!\n");

  } catch (error) {
    console.error("\n❌ Error en la verificación:", error);
    process.exit(1);
  }
}

// Run verification
verifyTestDatabase();
