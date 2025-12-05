import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { ReadPatientByIdUseCase } from "./readPatientById.useCase";
import { CustomError } from "../../errors/customError";
import { Patient } from "../../entities/patient.entity";
import { Genres } from "../../types/genres.type";

describe("ReadPatientByIdUseCase", () => {
  let mockRepository: PatientRepoImplementation;
  let useCase: ReadPatientByIdUseCase;

  // Test constants
  const VALID_ID = '123';
  const INVALID_ID = "ABC";
  const EMPTY_ID = "";
  
  const MOCK_PATIENT_DATA = {
    dni: "12345678",
    firstName: "John",
    lastName: "Doe",
    birthDate: new Date("1990-01-01"),
    email: "john@example.com",
    sex: Genres.MALE,
    id: VALID_ID
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
    (mockRepository.findById as jest.Mock).mockRejectedValue(error);

    try {
      await useCase.execute({ id: VALID_ID });
      fail("Should have thrown an error");
    } catch (thrownError) {
      expect(thrownError).toBeInstanceOf(CustomError);
      expect((thrownError as CustomError).statusCode).toBe(expectedStatusCode);
      expect((thrownError as CustomError).message).toBe(expectedMessage);
    }

    expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
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
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("Successful operations", () => {
    it("should return a patient when found by ID", async () => {
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

      const result = await useCase.execute({ id: VALID_ID });

      expect(result).toEqual(mockPatient);
      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("should return NULL if patient does NOT exist", async () => {
      (mockRepository.findById as jest.Mock).mockResolvedValue(null);

      try {
        await useCase.execute({ id: VALID_ID });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(404);
        expect((error as CustomError).message).toBe("Patient not found");
      }

      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe("Input validation", () => {
    it("should throw CustomError with correct status code for invalid ID", async () => {
      try {
        await useCase.execute({ id: INVALID_ID });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toContain('ID must be a positive integer');
      }
      
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    it("should throw CustomError with correct status code for empty ID", async () => {
      try {
        await useCase.execute({ id: EMPTY_ID });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toContain('ID must be a positive integer');
      }
      
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });

    // Edge case: null/undefined IDs
    it("should handle null ID gracefully", async () => {
      try {
        await useCase.execute({ id: null });
        fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toContain('ID must be a positive integer');
      }
      
      expect(mockRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    describe("Repository errors", () => {
      it("should handle generic repository errors with 500 status", async () => {
        // Arrange
        (mockRepository.findById as jest.Mock).mockRejectedValue(new Error('Generic database error'));

        // Act & Assert
        try {
          await useCase.execute({ id: VALID_ID });
          fail("Should have thrown an error");
        } catch (error) {
          expect(error).toBeInstanceOf(CustomError);
          expect((error as CustomError).statusCode).toBe(500);
          expect((error as CustomError).message).toBe("Error fetching patient from DB");
        }

        expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
        expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      });

      it("should handle unknown error types with 500 status", async () => {
        // Arrange
        (mockRepository.findById as jest.Mock).mockRejectedValue("String error");

        // Act & Assert
        try {
          await useCase.execute({ id: VALID_ID });
          fail("Should have thrown an error");
        } catch (error) {
          expect(error).toBeInstanceOf(CustomError);
          expect((error as CustomError).statusCode).toBe(500);
          expect((error as CustomError).message).toBe("Error fetching patient from DB");
        }

        expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
        expect(mockRepository.findById).toHaveBeenCalledTimes(1);
      });
    });
  });
});
