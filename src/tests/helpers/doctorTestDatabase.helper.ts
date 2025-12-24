import { MySQLDatabase } from "../../data/mysql/mysql.init";
import { EntityID } from "../../domain/valueObjects/entityID";
import { TestDatabaseBaseHelper } from "./testDatabaseBase.helper";

/**
 * Helper for managing doctor-specific test database operations
 * Extends base helper with doctor CRUD operations
 */
export class DoctorTestDatabaseHelper extends TestDatabaseBaseHelper {
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
