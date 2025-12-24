
/**
 * Test data factory for creating Doctor test data
 * Provides reusable functions to generate valid and invalid doctor data
 */
export class PatientTestDataFactory {
  private static emailCounter = 0;
  private static dniCounter = 0;

  /**
   * Generate a unique email for testing
   * Prevents duplicate email errors in tests
   */
  private static generateUniqueEmail(): string {
    this.emailCounter++;
    return `patient${this.emailCounter}_${Date.now()}@test.com`;
  }

  /**
   * Generate a unique DNI for testing
   * Prevents duplicate DNI errors in tests
   */
  private static generateUniqueDni(): string {
    this.dniCounter++;
    const timestamp = Date.now().toString().slice(-6);
    return `${timestamp}${this.dniCounter.toString().padStart(2, '0')}`;
  }

  /**
   * Create a valid doctor object for testing
   * @param overrides Optional fields to override default values
   */
  static createValidPatient(overrides?: Partial<{
    dni: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    email: string
    sex: string;
  }>) {
    return {
      firstName: overrides?.firstName || "Dr. John Smith",
      lastName: overrides?.lastName || "Doe",
      dni: overrides?.dni || this.generateUniqueDni(),
      birthDate: overrides?.birthDate || new Date("1980-01-01"),
      email: overrides?.email || this.generateUniqueEmail(),
      sex: overrides?.sex || "male",
    };
  }

  /**
   * Create multiple valid doctors for testing
   * @param count Number of doctors to create
   */
  static createValidPatients(count: number) {

    return Array.from({ length: count }, (_, index) => ({
      firstName: `Test Patient ${index + 1}`,
      lastName: "Doe",
      dni: this.generateUniqueDni(),
      birthDate: new Date("1980-01-01"),
      email: this.generateUniqueEmail(),
      sex: "male",
    }));
  }

  /**
   * Create an invalid doctor with missing required fields
   */
  static createPatientWithMissingFirstName() {
    return {
      lastName: "Doe",
      dni: "12345678",
      birthDate: new Date("1980-01-01"),
      email: this.generateUniqueEmail(),
      sex: "male",
    };
  }

  /**
   * Create an invalid doctor with missing specialty
   */
  // static createDoctorWithMissingSpecialty() {
  //   return {
  //     name: "Dr. John Smith",
  //     email: this.generateUniqueEmail(),
  //     phone: "+1234567890",
  //   };
  // }

  /**
   * Create an invalid doctor with invalid email format
   */
  static createPatientWithInvalidEmail() {
    return {
      firstName: "Test Patient",
      lastName: "Doe",
      dni: "12345678",
      birthDate: new Date("1980-01-01"),
      email: "invalid-email-format",
      sex: "male",
    };
  }

  /**
   * Create an invalid doctor with invalid specialty
   */
  // static createDoctorWithInvalidSpecialty() {
  //   return {
  //     name: "Dr. John Smith",
  //     specialty: "INVALID_SPECIALTY",
  //     email: this.generateUniqueEmail(),
  //     phone: "+1234567890",
  //   };
  // }

  /**
   * Create a partial update object for testing updates
   */
  static createPartialUpdate(overrides?: Partial<{
    firstName: string;
    lastName: string;
    dni: string;
    birthDate: Date;
    email: string;
    sex: string;
  }>) {
    return overrides || { firstName: "Updated", lastName: "Patient" };
  }

  /**
   * Reset the email counter (useful for test isolation)
   */
  static reset() {
    this.emailCounter = 0;
  }

  
}
