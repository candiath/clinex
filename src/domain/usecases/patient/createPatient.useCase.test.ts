import { CreatePatientUseCase } from "./createPatient.useCase";
import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../../entities/patient.entity";
import { CustomError } from "../../errors/customError";
import { PatientDatasource } from "../../datasources/patientDatasource";
import { PatientInterface } from "../../interfaces/patient.interfaces";
import { error } from "console";

// Mock the repository
jest.mock(
  "../../../infrastructure/repositories/patientRepositoryImplementation"
);

describe("CreatePatientUseCase", () => {
  let createPatientUseCase: CreatePatientUseCase;
  let mockRepository: jest.Mocked<PatientRepoImplementation>;
  let mockDatasource: jest.Mocked<PatientDatasource>;

  // Test constants
  const VALID_PATIENT_DATA = {
    dni: "12345678",
    firstName: "John",
    lastName: "Doe",
    birthDate: "1990-01-01",
    email: "john.doe@example.com",
    sex: "male" as const,
  };

  const VALID_PATIENT_WITHOUT_EMAIL = {
    dni: "87654321",
    firstName: "Jane",
    lastName: "Smith",
    birthDate: "1985-05-15",
    sex: "female" as const,
  };

  // Helper function to create expected Patient instance
  const createExpectedPatient = (data: any, email = ""): Patient => {
    return new Patient(
      data.dni,
      data.firstName,
      data.lastName,
      data.birthDate,
      data.email || email,
      data.sex
    );
  };

  // Helper function to test validation errors
  const testValidationError = async (
    invalidData: any,
    expectedErrorMessage: string
  ) => {
    await expect(createPatientUseCase.execute(invalidData)).rejects.toThrow(
      expectedErrorMessage
    );

    expect(mockRepository.save).not.toHaveBeenCalled();
  };

  // Helper function to test missing field errors
  const testMissingFieldError = async (
    baseData: any,
    fieldToRemove: string,
    expectedErrorMessage: string
  ) => {
    const invalidData = { ...baseData };
    delete invalidData[fieldToRemove];

    await testValidationError(invalidData, expectedErrorMessage);
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create mock datasource
    mockDatasource = {
      save: jest.fn(),
      findById: jest.fn(),
      findByDni: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      list: jest.fn(),
      exists: jest.fn(),
    } as jest.Mocked<PatientDatasource>;

    // Create mock repository
    mockRepository = new PatientRepoImplementation(
      mockDatasource
    ) as jest.Mocked<PatientRepoImplementation>;
    mockRepository.save = jest.fn();

    // Create use case instance
    createPatientUseCase = new CreatePatientUseCase(mockRepository);

    // Mock console methods to avoid noise in test output
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    // Restore console methods
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("Successful patient creation", () => {
    it("should create a patient successfully with all required fields", async () => {
      // Arrange
      const expectedPatient = createExpectedPatient(
        VALID_PATIENT_DATA,
        VALID_PATIENT_DATA.email
      );
      mockRepository.save.mockResolvedValue(expectedPatient);

      // Act
      const result = await createPatientUseCase.execute(
        VALID_PATIENT_DATA as any
      );

      // Assert
      expect(result).toBeInstanceOf(Patient);
      expect(result?.dni).toBe(VALID_PATIENT_DATA.dni);
      expect(result?.firstName).toBe(VALID_PATIENT_DATA.firstName);
      expect(result?.lastName).toBe(VALID_PATIENT_DATA.lastName);
      expect(result?.email).toBe(VALID_PATIENT_DATA.email);
      expect(result?.sex).toBe(VALID_PATIENT_DATA.sex);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it("should create a patient successfully with empty email", async () => {
      // Arrange
      const expectedPatient = createExpectedPatient(
        VALID_PATIENT_WITHOUT_EMAIL
      );
      mockRepository.save.mockResolvedValue(expectedPatient);

      // Act
      const result = await createPatientUseCase.execute(
        VALID_PATIENT_WITHOUT_EMAIL as any
      );

      // Assert
      expect(result).toBeInstanceOf(Patient);
      expect(result?.dni).toBe(VALID_PATIENT_WITHOUT_EMAIL.dni);
      expect(result?.firstName).toBe(VALID_PATIENT_WITHOUT_EMAIL.firstName);
      expect(result?.lastName).toBe(VALID_PATIENT_WITHOUT_EMAIL.lastName);
      expect(result?.sex).toBe(VALID_PATIENT_WITHOUT_EMAIL.sex);
      expect(result?.email).toBe("");
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("Input validation", () => {
    describe("DTO validation errors", () => {
      it("should throw CustomError when data is null", async () => {
        await testValidationError(
          null,
          "Invalid input: expected object, received null"
        );
      });

      it("should throw CustomError when data is empty object", async () => {
        try {
          await createPatientUseCase.execute({} as PatientInterface);
        } catch (error) {
          expect((error as CustomError).message).toContain(
            "Invalid input: expected number, received NaN"
          );
          expect((error as CustomError).message).toContain("Name is required");
          expect((error as CustomError).message).toContain(
            "Invalid birth date"
          );
          expect((error as CustomError).message).toContain(
            "Invalid option: expected one of"
          );
        }
      });
    });

    describe("Required field validations", () => {
      it("should throw CustomError when DNI is missing", async () => {
        await testMissingFieldError(
          VALID_PATIENT_DATA,
          "dni",
          "Invalid input: expected number, received NaN"
        );
      });

      it("should throw CustomError when firstName is missing", async () => {
        await testMissingFieldError(
          VALID_PATIENT_DATA,
          "firstName",
          "Name is required"
        );
      });

      it("should throw CustomError when lastName is missing", async () => {
        await testMissingFieldError(
          VALID_PATIENT_DATA,
          "lastName",
          "Name is required"
        );
      });

      it("should throw CustomError when birthDate is missing", async () => {
        await testMissingFieldError(
          VALID_PATIENT_DATA,
          "birthDate",
          "Invalid birth date"
        );
      });

      it("should throw CustomError when sex is missing", async () => {
        await testMissingFieldError(
          VALID_PATIENT_DATA,
          "sex",
          "Invalid option: expected one of"
        );
      });
    });
  });

  describe("Error handling", () => {
    describe("Database errors", () => {
      it("should throw CustomError.conflict when patient with same DNI already exists", async () => {
        // Arrange
        const duplicateError = CustomError.conflict(
          `Patient with DNI ${VALID_PATIENT_DATA.dni} already exists`
        );
        mockRepository.save.mockRejectedValue(duplicateError);

        // Act & Assert
        await expect(
          createPatientUseCase.execute(VALID_PATIENT_DATA as any)
        ).rejects.toThrow(duplicateError);

        expect(mockRepository.save).toHaveBeenCalledTimes(1);
      });

      it("should throw CustomError.internalServerError for other database errors", async () => {
        // Arrange
        const genericError = CustomError.internalServerError(
          "Database connection failed"
        );
        mockRepository.save.mockRejectedValue(genericError);

        // Act & Assert
        await expect(
          createPatientUseCase.execute(VALID_PATIENT_DATA as any)
        ).rejects.toThrow(genericError);

        expect(mockRepository.save).toHaveBeenCalledTimes(1);
      });

      it("should handle database errors that are not duplicate key errors", async () => {
        // Arrange
        const otherError = CustomError.internalServerError(
          "Some other database error"
        );
        mockRepository.save.mockRejectedValue(otherError);

        // Act & Assert
        await expect(
          createPatientUseCase.execute(VALID_PATIENT_DATA as any)
        ).rejects.toThrow(otherError);

        expect(mockRepository.save).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Edge cases and data validation", () => {
    it("should handle all valid sex options", async () => {
      // Arrange
      const sexOptions: Array<"male" | "female" | "other" | "prefer not to say"> = [
        "male",
        "female",
        "other",
        "prefer not to say"
      ];

      // Act & Assert
      for (const sex of sexOptions) {
        const patientData = {
          ...VALID_PATIENT_DATA,
          dni: `1234567`, // Unique DNI for each test
          sex,
        };

        const expectedPatient = createExpectedPatient(
          patientData,
          patientData.email
        );
        mockRepository.save.mockResolvedValue(expectedPatient);

        const result = await createPatientUseCase.execute(patientData as any);
        expect(result?.sex).toBe(sex);
        expect(result?.dni).toBe(`1234567`);
      }

      expect(mockRepository.save).toHaveBeenCalledTimes(4);
    });

    it("should create patient with birthDate as string and handle it properly", async () => {
      // Arrange
      const patientData = {
        ...VALID_PATIENT_DATA,
        birthDate: "1990-01-01", // Explicitly test string format
      };

      const expectedPatient = createExpectedPatient(
        patientData,
        patientData.email
      );
      mockRepository.save.mockResolvedValue(expectedPatient);

      // Act
      const result = await createPatientUseCase.execute(patientData as any);

      // Assert
      expect(result).toBeInstanceOf(Patient);
      // birthDate is stored as provided in the Patient entity
      expect(result?.birthDate).toBe(patientData.birthDate);
      expect(result?.dni).toBe(VALID_PATIENT_DATA.dni);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it("should handle different email formats correctly", async () => {
      // Arrange
      const emailVariations = [
        "user@domain.com",
        // "user.name@domain.co.uk",
        // "user+label@domain.org",
        // "", // Empty email should be allowed
      ];

      // Act & Assert
      for (let i = 0; i < emailVariations.length; i++) {
        const email = emailVariations[i];
        const patientData = {
          ...VALID_PATIENT_DATA,
          dni: `1234567${i}`, // Unique DNI for each test
          email,
        };

        const expectedPatient = createExpectedPatient(patientData, email);
        mockRepository.save.mockResolvedValue(expectedPatient);

        const result = await createPatientUseCase.execute(patientData as unknown as PatientInterface);
        expect(result?.email).toBe(email);
        expect(result?.dni).toBe(`1234567${i}`);
      }

      expect(mockRepository.save).toHaveBeenCalledTimes(emailVariations.length);
    });

    it("should handle different birthDate formats consistently", async () => {
      // Arrange
      const birthDateFormats = [
        "1990-01-01T00:00:00.000Z",
        "1985-12-25",
        "2000-06-15",
      ];

      // Act & Assert
      for (let i = 0; i < birthDateFormats.length; i++) {
        const birthDate = birthDateFormats[i];
        const patientData = {
          ...VALID_PATIENT_DATA,
          dni: `9876543${i}`, // Unique DNI for each test
          birthDate,
        };

        const expectedPatient = createExpectedPatient(
          patientData,
          patientData.email
        );
        mockRepository.save.mockResolvedValue(expectedPatient);

        const result = await createPatientUseCase.execute(patientData as any);
        expect(result?.birthDate).toBe(birthDate);
        expect(result?.dni).toBe(`9876543${i}`);
      }

      expect(mockRepository.save).toHaveBeenCalledTimes(
        birthDateFormats.length
      );
    });
  });
});
