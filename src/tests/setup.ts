/**
 * Jest setup file for integration tests
 * Loads .env.test configuration before running tests
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.test file for integration tests
// IMPORTANT: override: true ensures .env.test takes precedence over .env
const envTestPath = path.resolve(__dirname, '../../.env.test');
dotenv.config({ path: envTestPath, override: true });

console.log('🔧 Test environment loaded from .env.test');
console.log(`   MYSQL_DATABASE: ${process.env.MYSQL_DATABASE}`);
console.log(`   MYSQL_PORT: ${process.env.MYSQL_PORT}`);
