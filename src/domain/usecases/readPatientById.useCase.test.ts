import { Types } from "mongoose";
import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { ReadPatientByIdUseCase } from "./readPatientById.useCase";
import { CustomError } from "../errors/customErrors";
import { Patient } from "../entities/patient";

jest.mock("mongoose");

describe("ReadPatientByIdUseCase", () => {
  let mockRepository: PatientRepoImplementation;
  let useCase: ReadPatientByIdUseCase;
  const mockIsValid = jest.fn();

  // Test constants
  const VALID_OBJECT_ID = "507f1f77bcf86cd799439011";
  const INVALID_ID = "ABC";
  const EMPTY_ID = "";
  
  const MOCK_PATIENT_DATA = {
    dni: "12345678",
    firstName: "John",
    lastName: "Doe",
    birthDate: new Date("1990-01-01"),
    email: "john@example.com",
    sex: "male" as const,
    id: VALID_OBJECT_ID
  };

  // Helper function to create Mongoose-like errors
  const createMongoError = (name: string, message: string): Error => {
    const error = new Error(message);
    error.name = name;
    return error;
  };

  // Helper function to test error scenarios
  const testErrorScenario = async (
    error: any,
    expectedStatusCode: number,
    expectedMessage: string
  ) => {
    mockIsValid.mockReturnValue(true);
    (mockRepository.findById as jest.Mock).mockRejectedValue(error);

    try {
      await useCase.execute(VALID_OBJECT_ID);
      fail("Should have thrown an error");
    } catch (thrownError) {
      expect(thrownError).toBeInstanceOf(CustomError);
      expect((thrownError as CustomError).statusCode).toBe(expectedStatusCode);
      expect((thrownError as CustomError).message).toBe(expectedMessage);
    }

    expect(mockRepository.findById).toHaveBeenCalledWith(VALID_OBJECT_ID);
    expect(mockRepository.findById).toHaveBeenCalledTimes(1);
  };

  beforeEach(() => {
    // Mock del repositorio
    mockRepository = {
      findById: jest.fn(),
    } as unknown as PatientRepoImplementation;

    useCase = new ReadPatientByIdUseCase(mockRepository);

    // Mock console methods
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
    
    // Mock Mongoose
    (Types.ObjectId.isValid as jest.Mock) = mockIsValid;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("Successful operations", () => {
    it("should return a patient when found by ID", async () => {
      mockIsValid.mockReturnValue(true);

      const mockPatient = new Patient(
        MOCK_PATIENT_DATA.dni,
        MOCK_PATIENT_DATA.firstName,
        MOCK_PATIENT_DATA.lastName,
        MOCK_PATIENT_DATA.birthDate,
        MOCK_PATIENT_DATA.email,
        MOCK_PATIENT_DATA.sex,
        MOCK_PATIENT_DATA.id
      );

      (mockRepository.findById as jest.Mock).mockResolvedValue(mockPatient);

      const result = await useCase.execute(VALID_OBJECT_ID);

      expect(result).toEqual(mockPatient);
      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_OBJECT_ID);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("should return NULL if patient does NOT exist", async () => {
      mockIsValid.mockReturnValue(true);

      (mockRepository.findById as jest.Mock).mockResolvedValue(null);

      const result = await useCase.execute(VALID_OBJECT_ID);

      expect(result).toBe(null);
      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_OBJECT_ID);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("Input validation", () => {
    it("should throw CustomError with correct status code for invalid ID", async () => {
      mockIsValid.mockReturnValue(false);

      try {
        await useCase.execute(INVALID_ID);
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toBe("Invalid ID format");
      }
      
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw CustomError with correct status code for empty ID", async () => {
      mockIsValid.mockReturnValue(false);

      try {
        await useCase.execute(EMPTY_ID);
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toBe("Invalid ID format");
      }
      
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    // Edge case: null/undefined IDs
    it("should handle null ID gracefully", async () => {
      mockIsValid.mockReturnValue(false);

      try {
        await useCase.execute(null as any);
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toBe("Invalid ID format");
      }
      
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    describe("Generic errors", () => {
      it("should handle generic repository errors", async () => {
        // Arrange
        mockIsValid.mockReturnValue(true);
        (mockRepository.findById as jest.Mock).mockRejectedValue(new Error('Generic database error'));

        // Act & Assert
        try {
          await useCase.execute(VALID_OBJECT_ID);
          fail("Should have thrown an error");
        } catch (error) {
          expect(error).toBeInstanceOf(CustomError);
          expect((error as CustomError).statusCode).toBe(500);
          expect((error as CustomError).message).toBe("Internal database error occurred");
        }

        expect(mockRepository.findById).toHaveBeenCalledWith(VALID_OBJECT_ID);
        expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      });

      it("should handle unknown error types", async () => {
        // Arrange
        mockIsValid.mockReturnValue(true);
        (mockRepository.findById as jest.Mock).mockRejectedValue("String error");

        // Act & Assert
        try {
          await useCase.execute(VALID_OBJECT_ID);
          fail("Should have thrown an error");
        } catch (error) {
          expect(error).toBeInstanceOf(CustomError);
          expect((error as CustomError).statusCode).toBe(500);
          expect((error as CustomError).message).toBe("An unexpected error occurred");
        }

        expect(mockRepository.findById).toHaveBeenCalledWith(VALID_OBJECT_ID);
        expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      });
    });

    describe("Mongoose-specific errors", () => {
      it("should handle mongoose network errors", async () => {
        const mongoError = createMongoError('MongoNetworkError', 'Connection timeout');
        await testErrorScenario(mongoError, 500, "Database connection unavailable");
      });

      it("should handle mongoose server selection errors", async () => {
        const mongoError = createMongoError('MongoServerSelectionError', 'Server selection timeout');
        await testErrorScenario(mongoError, 500, "Database connection unavailable");
      });

      it("should handle mongoose cast errors", async () => {
        const mongoError = createMongoError('CastError', 'Cast to ObjectId failed');
        await testErrorScenario(mongoError, 400, "Invalid patient ID format");
      });

      it("should handle mongoose timeout errors", async () => {
        const mongoError = createMongoError('MongoTimeoutError', 'Operation timed out');
        await testErrorScenario(mongoError, 500, "Database operation timed out");
      });

      it("should handle mongoose validation errors", async () => {
        const mongoError = createMongoError('ValidationError', 'Validation failed');
        await testErrorScenario(mongoError, 400, "Invalid data format");
      });
    });

    describe("Domain error preservation", () => {
      it("should preserve CustomError from repository", async () => {
        const customError = CustomError.notFound('Patient not found in database');
        await testErrorScenario(customError, 404, "Patient not found in database");
      });

      it("should preserve CustomError with different status codes", async () => {
        const customError = CustomError.forbidden('Access denied');
        await testErrorScenario(customError, 403, "Access denied");
      });
    });
  });
});
