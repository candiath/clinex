import { MySQLDatabase } from "../../data/mysql/mysql.init";
import { EntityID } from "../../domain/valueObjects/entityID";
import { TestDatabaseBaseHelper } from "./testDatabaseBase.helper";

/**
 * Helper for managing patient-specific test database operations
 * Extends base helper with patient CRUD operations
 */
export class PatientTestDatabaseHelper extends TestDatabaseBaseHelper {
  /**
   * Clear all data from the patients table
   * Useful for test isolation when needed
   */
  static async clearPatientsTable(): Promise<void> {
    try {
      await MySQLDatabase.pool.execute("DELETE FROM patients");
      await MySQLDatabase.pool.execute("ALTER TABLE patients AUTO_INCREMENT = 1");
    } catch (error) {
      console.error("❌ Failed to clear patients table:", error);
      throw error;
    }
  }

  /**
   * Get a patient by ID directly from the database
   * Useful for verification in tests
   */
  static async getPatientById(id: number | EntityID): Promise<Record<string, unknown> | null> {
    try {
      const idValue = id instanceof EntityID ? id.getValue() : id;
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM patients WHERE id = ?",
        [idValue]
      );
      const patients = rows as Record<string, unknown>[];
      return patients.length > 0 ? patients[0] : null;
    } catch (error) {
      console.error("❌ Failed to get patient by ID:", error);
      throw error;
    }
  }

  /**
   * Get a patient by DNI directly from the database
   * Useful for verification in tests
   */
  static async getPatientByDni(dni: string): Promise<Record<string, unknown> | null> {
    try {
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM patients WHERE dni = ?",
        [dni]
      );
      const patients = rows as Record<string, unknown>[];
      return patients.length > 0 ? patients[0] : null;
    } catch (error) {
      console.error("❌ Failed to get patient by DNI:", error);
      throw error;
    }
  }

  /**
   * Get a patient by email directly from the database
   * Useful for verification in tests
   */
  static async getPatientByEmail(email: string): Promise<Record<string, unknown> | null> {
    try {
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM patients WHERE email = ?",
        [email]
      );
      const patients = rows as Record<string, unknown>[];
      return patients.length > 0 ? patients[0] : null;
    } catch (error) {
      console.error("❌ Failed to get patient by email:", error);
      throw error;
    }
  }

  /**
   * Insert a patient directly into the database
   * Useful for seeding test data
   */
  static async seedPatient(patient: {
    dni: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: Date;
    sex?: string;
  }): Promise<number> {
    try {
      const [result] = await MySQLDatabase.pool.execute(
        "INSERT INTO patients (dni, first_name, last_name, email, birth_date, sex) VALUES (?, ?, ?, ?, ?, ?)",
        [patient.dni, patient.firstName, patient.lastName, patient.email, patient.birthDate, patient.sex || 'other']
      );
      const insertResult = result as { insertId: number };
      return insertResult.insertId;
    } catch (error) {
      console.error("❌ Failed to seed patient:", error);
      throw error;
    }
  }

  /**
   * Get the count of patients in the database
   */
  static async getPatientCount(): Promise<number> {
    try {
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT COUNT(*) as count FROM patients"
      );
      const result = rows as { count: number }[];
      return result[0].count;
    } catch (error) {
      console.error("❌ Failed to get patient count:", error);
      throw error;
    }
  }
}
