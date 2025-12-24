import { DoctorSpecialty } from "../../domain/types/doctorSpecialty.type";

/**
 * Test data factory for creating Doctor test data
 * Provides reusable functions to generate valid and invalid doctor data
 */
export class TestDataFactory {
  private static emailCounter = 0;

  /**
   * Generate a unique email for testing
   * Prevents duplicate email errors in tests
   */
  private static generateUniqueEmail(): string {
    this.emailCounter++;
    return `doctor${this.emailCounter}_${Date.now()}@test.com`;
  }

  /**
   * Create a valid doctor object for testing
   * @param overrides Optional fields to override default values
   */
  static createValidDoctor(overrides?: Partial<{
    name: string;
    specialty: DoctorSpecialty;
    email: string;
    phone: string;
  }>) {
    return {
      name: overrides?.name || "Dr. John Smith",
      specialty: overrides?.specialty || DoctorSpecialty.CARDIOLOGY,
      email: overrides?.email || this.generateUniqueEmail(),
      phone: overrides?.phone || "+1234567890",
    };
  }

  /**
   * Create multiple valid doctors for testing
   * @param count Number of doctors to create
   */
  static createValidDoctors(count: number) {
    const specialties: DoctorSpecialty[] = [
      DoctorSpecialty.CARDIOLOGY,
      DoctorSpecialty.DERMATOLOGY,
      DoctorSpecialty.NEUROLOGY,
      DoctorSpecialty.PEDIATRICS,
      DoctorSpecialty.PSYCHIATRY,
    ];

    return Array.from({ length: count }, (_, index) => ({
      name: `Dr. Test Doctor ${index + 1}`,
      specialty: specialties[index % specialties.length],
      email: this.generateUniqueEmail(),
      phone: `+123456789${index}`,
    }));
  }

  /**
   * Create an invalid doctor with missing required fields
   */
  static createDoctorWithMissingName() {
    return {
      specialty: DoctorSpecialty.CARDIOLOGY,
      email: this.generateUniqueEmail(),
      phone: "+1234567890",
    };
  }

  /**
   * Create an invalid doctor with missing specialty
   */
  static createDoctorWithMissingSpecialty() {
    return {
      name: "Dr. John Smith",
      email: this.generateUniqueEmail(),
      phone: "+1234567890",
    };
  }

  /**
   * Create an invalid doctor with invalid email format
   */
  static createDoctorWithInvalidEmail() {
    return {
      name: "Dr. John Smith",
      specialty: DoctorSpecialty.CARDIOLOGY,
      email: "invalid-email-format",
      phone: "+1234567890",
    };
  }

  /**
   * Create an invalid doctor with invalid specialty
   */
  static createDoctorWithInvalidSpecialty() {
    return {
      name: "Dr. John Smith",
      specialty: "INVALID_SPECIALTY",
      email: this.generateUniqueEmail(),
      phone: "+1234567890",
    };
  }

  /**
   * Create a partial update object for testing updates
   */
  static createPartialUpdate(overrides?: Partial<{
    name: string;
    specialty: DoctorSpecialty;
    email: string;
    phone: string;
  }>) {
    return overrides || { name: "Dr. Updated Name" };
  }

  /**
   * Reset the email counter (useful for test isolation)
   */
  static reset() {
    this.emailCounter = 0;
  }
}
