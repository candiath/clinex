import { MySQLDatabase } from "../../data/mysql/mysql.init";
import { EntityID } from "../../domain/valueObjects/entityID";
import { TestDatabaseBaseHelper } from "./testDatabaseBase.helper";
import { AppointmentStatus } from "../../domain/valueObjects/appointmentStatus";

/**
 * Helper for managing appointment-specific test database operations
 * Extends base helper with appointment CRUD operations
 */
export class AppointmentTestDatabaseHelper extends TestDatabaseBaseHelper {
  /**
   * Clear all data from the appointments table
   * Useful for test isolation when needed
   */
  static async clearAppointmentsTable(): Promise<void> {
    try {
      await MySQLDatabase.pool.execute("DELETE FROM appointments");
      await MySQLDatabase.pool.execute("ALTER TABLE appointments AUTO_INCREMENT = 1");
    } catch (error) {
      console.error("❌ Failed to clear appointments table:", error);
      throw error;
    }
  }

  /**
   * Get an appointment by ID directly from the database
   * Useful for verification in tests
   */
  static async getAppointmentById(id: number | EntityID): Promise<Record<string, unknown> | null> {
    try {
      const idValue = id instanceof EntityID ? id.getValue() : id;
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM appointments WHERE id = ?",
        [idValue]
      );
      const appointments = rows as Record<string, unknown>[];
      return appointments.length > 0 ? appointments[0] : null;
    } catch (error) {
      console.error("❌ Failed to get appointment by ID:", error);
      throw error;
    }
  }

  /**
   * Get appointments by patient ID directly from the database
   * Useful for verification in tests
   */
  static async getAppointmentsByPatientId(patientId: number | EntityID): Promise<Record<string, unknown>[]> {
    try {
      const idValue = patientId instanceof EntityID ? patientId.getValue() : patientId;
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM appointments WHERE patient_id = ?",
        [idValue]
      );
      return rows as Record<string, unknown>[];
    } catch (error) {
      console.error("❌ Failed to get appointments by patient ID:", error);
      throw error;
    }
  }

  /**
   * Get appointments by doctor ID directly from the database
   * Useful for verification in tests
   */
  static async getAppointmentsByDoctorId(doctorId: number | EntityID): Promise<Record<string, unknown>[]> {
    try {
      const idValue = doctorId instanceof EntityID ? doctorId.getValue() : doctorId;
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT * FROM appointments WHERE doctor_id = ?",
        [idValue]
      );
      return rows as Record<string, unknown>[];
    } catch (error) {
      console.error("❌ Failed to get appointments by doctor ID:", error);
      throw error;
    }
  }

  /**
   * Insert an appointment directly into the database
   * Useful for seeding test data
   * Accepts domain format (camelCase) and transforms to DB format (snake_case)
   */
  static async seedAppointment(appointment: {
    patientId: number;
    doctorId: number;
    dateTime: Date;
    status: string;
    reason?: string;
    notes?: string;
  }): Promise<number> {
    try {
      const patientIdValue = appointment.patientId;
      const doctorIdValue = appointment.doctorId;
      const statusValue = appointment.status;

      const [result] = await MySQLDatabase.pool.execute(
        "INSERT INTO appointments (patient_id, doctor_id, date_time, status, reason, notes) VALUES (?, ?, ?, ?, ?, ?)",
        [
          patientIdValue,
          doctorIdValue,
          appointment.dateTime,
          statusValue,
          appointment.reason || null,
          appointment.notes || null
        ]
      );
      const insertResult = result as { insertId: number };
      return insertResult.insertId;
    } catch (error) {
      console.error("❌ Failed to seed appointment:", error);
      throw error;
    }
  }

  /**
   * Get the count of appointments in the database
   */
  static async getAppointmentCount(): Promise<number> {
    try {
      const [rows] = await MySQLDatabase.pool.execute(
        "SELECT COUNT(*) as count FROM appointments"
      );
      const result = rows as { count: number }[];
      return result[0].count;
    } catch (error) {
      console.error("❌ Failed to get appointment count:", error);
      throw error;
    }
  }
}
