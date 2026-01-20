import { MySQLDatabase, MySQLConfig } from "../../data/mysql/mysql.init";
import { MigrationRunner } from "../../data/mysql/migrations.runner";

/**
 * Base helper for managing test database operations
 * Provides common setup, teardown, and configuration for integration tests
 */
export class TestDatabaseBaseHelper {
  private static isConnected = false;

  /**
   * Get test database configuration
   * Reads from environment variables with TEST prefix or defaults
   */
  static getTestConfig(): MySQLConfig {
    return {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3307', 10),
      user: process.env.MYSQL_USER || 'test_user',
      password: process.env.MYSQL_PASSWORD || 'test_password',
      database: process.env.MYSQL_DATABASE || 'clinex_test',
      waitForConnections: true,
      connectionLimit: 5, // Lower for tests
      queueLimit: 0,
      connectTimeout: 10000, // Shorter timeout for tests
    };
  }

  /**
   * Connect to the test database
   * Should be called in beforeAll()
   */
  static async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("Test database already connected");
      return;
    }

    try {
      // Set test-specific configuration
      const testConfig = this.getTestConfig();
      MySQLDatabase.setConfig(testConfig);
      
      console.log(`🔧 Test Config: ${testConfig.database} @ ${testConfig.host}:${testConfig.port}`);
      
      await MySQLDatabase.connect();
      
      // Run migrations to ensure schema is up-to-date
      await MigrationRunner.runMigrations();
      
      this.isConnected = true;
      // console.log("✅ Test database connected successfully");
    } catch (error) {
      console.error("❌ Failed to connect to test database:", error);
      throw error;
    }
  }

  /**
   * Disconnect from the test database
   * Should be called in afterAll()
   */
  static async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await MySQLDatabase.pool.end();
      MySQLDatabase.reset(); // Clear configuration
      this.isConnected = false;
      console.log("✅ Test database disconnected");
    } catch (error) {
      console.error("❌ Failed to disconnect from test database:", error);
      throw error;
    }
  }

  /**
   * Clear all tables in the database
   * Use with caution - clears ALL data
   */
  static async clearAllTables(): Promise<void> {
    try {
      await MySQLDatabase.pool.execute("SET FOREIGN_KEY_CHECKS = 0");
      await MySQLDatabase.pool.execute("DELETE FROM doctors");
      await MySQLDatabase.pool.execute("ALTER TABLE doctors AUTO_INCREMENT = 1");
      await MySQLDatabase.pool.execute("DELETE FROM patients");
      await MySQLDatabase.pool.execute("ALTER TABLE patients AUTO_INCREMENT = 1");
      await MySQLDatabase.pool.execute("SET FOREIGN_KEY_CHECKS = 1");
    } catch (error) {
      console.error("❌ Failed to clear all tables:", error);
      throw error;
    }
  }

  /**
   * Execute a raw SQL query
   * Useful for custom test scenarios
   */
  static async executeQuery(query: string, params: unknown[] = []): Promise<unknown> {
    try {
      const [result] = await MySQLDatabase.pool.execute(query, params);
      return result;
    } catch (error) {
      console.error("❌ Failed to execute query:", error);
      throw error;
    }
  }
}
