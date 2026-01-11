import { AppointmentStatus } from "../../domain/valueObjects/appointmentStatus";
import { EntityID } from "../../domain/valueObjects/entityID";

/**
 * Test data factory for creating Doctor test data
 * Provides reusable functions to generate valid and invalid doctor data
 */
export class TestDataFactory {

  /**
   * Create a valid appointment object for testing
   * @param overrides Optional fields to override default values
   */
  static createValidAppointment(overrides?: Partial<{
    patientId: number,
    doctorId: number,
    dateTime: Date,
    status: string,
    reason?: string,
    notes?: string,
    id?: number,
  }>) {
    return {
      patientId: overrides?.patientId || 123,
      doctorId: overrides?.doctorId || 456,
      dateTime: overrides?.dateTime || new Date("2030-03-01"),
      status: overrides?.status || "SCHEDULED",
      reason: overrides?.reason || "Routine check-up",
      notes: overrides?.notes || "No additional notes",
      id: overrides?.id || 789,
    };
  }

  /**
   * Create multiple valid doctors for testing
   * @param count Number of doctors to create
   */
  static createValidAppointments(count: number) {
    const statuses: string[] = [
      "SCHEDULED",
      "COMPLETED",
      "CANCELLED",
    ];
    return Array.from({ length: count }, (_, index) => ({
      patientId: `0+${index + 1}`,
      doctorId: `0+${index + 1}`,
      dateTime: new Date(),
      status: statuses[index % statuses.length],
      reason: "Routine check-up",
      notes: "No additional notes",
      id: `0+${index + 1}`,
    }));
  }

  /**
   * Create an invalid appointment with missing patientId
   */
  static createAppointmentWithMissingPatientId() {
    return {
      doctorId: 456,
      dateTime: new Date(),
      status: "SCHEDULED",
      reason: "Routine check-up",
    };
  }

  /**
   * Create an invalid appointment with missing doctorId
   */
  static createAppointmentWithMissingDoctorId() {
    return {
      patientId: 123,
      dateTime: new Date(),
      status: "SCHEDULED",
      reason: "Routine check-up",
    };
  }

  /**
   * Create an invalid appointment with missing dateTime
   */
  static createAppointmentWithMissingDateTime() {
    return {
      patientId: 123,
      doctorId: 456,
      status: "SCHEDULED",
      reason: "Routine check-up",
    };
  }

  /**
   * Create an invalid appointment with invalid status
   */
  static createAppointmentWithInvalidStatus() {
    return {
      patientId: 123,
      doctorId: 456,
      dateTime: new Date(),
      status: "INVALID_STATUS",
      reason: "Routine check-up",
    };
  }

  /**
   * Create a partial update object for testing updates
   */
  static createPartialUpdate(overrides?: Partial<{
    patientId: EntityID,
    doctorId: EntityID,
    dateTime: Date,
    status: AppointmentStatus,
    reason?: string,
    notes?: string,
  }>) {
    return overrides || { reason: "Updated reason" };
  }
}
