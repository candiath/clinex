import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../../entities/patient.entity";
import { Genres } from "../../types/genres.type";
import { EntityID } from "../../valueObjects/entityID";
import { ReadAllPatientsUseCase } from "./readAllPatients.useCase";

describe("ReadAllPatientsUseCase", () => {
  let mockRepository: PatientRepoImplementation;
  let useCase: ReadAllPatientsUseCase;

  beforeEach(() => {
    mockRepository = {
      list: jest.fn(),
    } as unknown as PatientRepoImplementation;
    
    useCase = new ReadAllPatientsUseCase(mockRepository);
    
    // Mock console.log para evitar ruido en los tests
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks(); // Restaura console.log original
  });

  describe("Successful cases", () => {
    it("should return a list of patients if there are patients", async () => {
      // Arrange (preparar)
      const mockPatients = [
        new Patient(
          "12345678",
          "John",
          "Doe",
          new Date("1990-01-01"),
          "john@example.com",
          Genres.MALE,
          EntityID.create("1")
        ),
      ];
      (mockRepository.list as jest.Mock).mockResolvedValue(mockPatients);

      // Act (ejecutar)
      const result = await useCase.execute();

      // Assert (verificar)
      expect(result).toEqual(mockPatients);
      expect(mockRepository.list).toHaveBeenCalledTimes(1);
      expect(mockRepository.list).toHaveBeenCalledWith();
    });
  });

  describe("Error handling", () => {
    it("should throw error when repository fails", async () => {
      // Tests de errores
      const errorMessage = "Database connection failed";
      const databaseError = new Error(errorMessage);
      (mockRepository.list as jest.Mock).mockRejectedValue(databaseError);
      await expect(useCase.execute()).rejects.toThrow(errorMessage);
      expect(mockRepository.list).toHaveBeenCalledTimes(1);

    });
  });

  describe("Behavior verification", () => {
    it("should return an empty object if there are no patients", async () => {
      // Verificar comportamientos específicos
      const mockPatients: Patient[] = [];
      (mockRepository.list as jest.Mock).mockResolvedValue(mockPatients);

      const result = await useCase.execute();

      expect(result).toEqual(mockPatients);
      expect(mockRepository.list).toHaveBeenCalledTimes(1);
      expect(mockRepository.list).toHaveBeenCalledWith();
    });
  });
});
