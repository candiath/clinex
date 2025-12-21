import { MySQLDatabase, MySQLConfig } from "../../data/mysql/mysql.init";
import { EntityID } from "../../domain/valueObjects/entityID";

/**
 * Helper for managing test database operations
 * Provides setup, teardown, and utility functions for integration tests
 */
export class TestDatabaseHelper {
  private static isConnected = false;

  /**
   * Get test database configuration
   * Reads from environment variables with TEST prefix or defaults
   */
  private static getTestConfig(): MySQLConfig {
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
      this.isConnected = true;
      console.log("✅ Test database connected successfully");
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
      await MySQLDatabase.pool.end();      MySQLDatabase.reset(); // Clear configuration      this.isConnected = false;
      console.log("✅ Test database disconnected");
    } catch (error) {
      console.error("❌ Failed to disconnect from test database:", error);
      throw error;
    }
  }

  /**
   * Clear all data from the doctors table
   * Useful for test isolation when needed
   */
  static async clearDoctorsTable(): Promise<void> {
    try {
      await MySQLDatabase.pool.execute("DELETE FROM doctors");
      await MySQLDatabase.pool.execute("ALTER TABLE doctors AUTO_INCREMENT = 1");
    } catch (error) {
      console.error("❌ Failed to clear doctors table:", error);
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
      await this.clearDoctorsTable();
      // Add other tables here when needed
      // await MySQLDatabase.pool.execute("DELETE FROM patients");
      // await MySQLDatabase.pool.execute("DELETE FROM appointments");
      await MySQLDatabase.pool.execute("SET FOREIGN_KEY_CHECKS = 1");
    } catch (error) {
      console.error("❌ Failed to clear all tables:", error);
      throw error;
    }
  }

  /**
   * Get a doctor by ID directly from the database
   * Useful for verification in tests
   */
  static async getDoctorById(id: number | EntityID): Promise<Record<string, unknown> | null> {
    try {
      const idValue = id instanceof EntityID ? id.getValue() : id;
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM doctors WHERE id = ?",
        [idValue]
      );
      const doctors = rows as Record<string, unknown>[];
      return doctors.length > 0 ? doctors[0] : null;
    } catch (error) {
      console.error("❌ Failed to get doctor by ID:", error);
      throw error;
    }
  }

  /**
   * Get a doctor by email directly from the database
   * Useful for verification in tests
   */
  static async getDoctorByEmail(email: string): Promise<Record<string, unknown> | null> {
    try {
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM doctors WHERE email = ?",
        [email]
      );
      const doctors = rows as Record<string, unknown>[];
      return doctors.length > 0 ? doctors[0] : null;
    } catch (error) {
      console.error("❌ Failed to get doctor by email:", error);
      throw error;
    }
  }

  /**
   * Insert a doctor directly into the database
   * Useful for seeding test data
   */
  static async seedDoctor(doctor: {
    name: string;
    specialty: string;
    email: string;
    phone: string;
  }): Promise<number> {
    try {
      const [result] = await MySQLDatabase.pool.execute(
        "INSERT INTO doctors (name, specialty, email, phone) VALUES (?, ?, ?, ?)",
        [doctor.name, doctor.specialty, doctor.email, doctor.phone]
      );
      const insertResult = result as { insertId: number };
      return insertResult.insertId;
    } catch (error) {
      console.error("❌ Failed to seed doctor:", error);
      throw error;
    }
  }

  /**
   * Get the count of doctors in the database
   */
  static async getDoctorCount(): Promise<number> {
    try {
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT COUNT(*) as count FROM doctors"
      );
      const result = rows as { count: number }[];
      return result[0].count;
    } catch (error) {
      console.error("❌ Failed to get doctor count:", error);
      throw error;
    }
  }
}
