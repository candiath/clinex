import fs from 'fs';
import path from 'path';
import { MySQLDatabase } from './mysql.init';

/**
 * Migration Runner
 * Executes SQL migration files in order
 * 
 *! CRITICAL: This should run BEFORE the app starts serving requests
 *! to ensure database schema matches the application expectations
 */
export class MigrationRunner {
  private static readonly MIGRATIONS_DIR = path.join(__dirname, '../migrations');
  
  //TODO: consider the implementation of CustomError instead
  /**
   * Execute all SQL migrations in alphabetical order
   * Expects that files are named with prefixes for ordering (e.g., 001-create-patients.sql)
   */
  static async runMigrations(): Promise<void> {
    try {
      console.log('Starting database migrations...');
      
      if (!MySQLDatabase.pool) {
        throw new Error('MySQL pool not initialized. Call MySQLDatabase.connect() first.');
      }

      const migrationFiles = fs.readdirSync(this.MIGRATIONS_DIR)
        .filter(file => file.endsWith('.sql'))
        .sort();

      if (migrationFiles.length === 0) {
        console.log('⚠️  No migration files found in', this.MIGRATIONS_DIR);
        return;
      }

      console.log(`📂 Found ${migrationFiles.length} migration file(s):`, migrationFiles);

      for (const file of migrationFiles) {
        await this.executeMigrationFile(file);
      }

      console.log('✅ All migrations completed successfully');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  /**
   * Execute a single migration file
   * Handles multiple SQL statements separated by semicolons
   */
  private static async executeMigrationFile(filename: string): Promise<void> {
    const filePath = path.join(this.MIGRATIONS_DIR, filename);
    console.log(`⏳ Executing: ${filename}`);

    try {
      const sqlContent = fs.readFileSync(filePath, 'utf-8');

      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        try {
          await MySQLDatabase.pool.execute(statement);
        } catch (error: any) {
          // Skip if table/index already exists (idempotent behavior)
          if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.code === 'ER_DUP_KEYNAME') {
            console.log(` Skipped: ${statement.substring(0, 50)}... (already exists)`);
            continue;
          }
          throw error; // Re-throw other errors
        }
      }

      console.log(`✅ Completed: ${filename}`);
    } catch (error: any) {
      console.error(`  ❌ Failed: ${filename}`, error.message);
      throw error;
    }
  }

  static async verifySchema(requiredTables: string[]): Promise<boolean> {
    try {
      const connection = await MySQLDatabase.pool.getConnection();
      
      for (const table of requiredTables) {
        const [rows] = await connection.execute(
          'SHOW TABLES LIKE ?',
          [table]
        );
        
        if ((rows as any[]).length === 0) {
          console.error(`❌ Table '${table}' does not exist`);
          connection.release();
          return false;
        }
      }
      
      connection.release();
      console.log('✅ Schema verification passed');
      return true;
    } catch (error) {
      console.error('❌ Schema verification failed:', error);
      return false;
    }
  }
}
