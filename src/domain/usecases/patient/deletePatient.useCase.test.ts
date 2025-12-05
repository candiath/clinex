import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { DeletePatientUseCase } from "./deletePatient.useCase";
import { CustomError } from "../../errors/customError";
import { Patient } from "../../entities/patient.entity";

describe('DeletePatientUseCase', () => {
  const VALID_ID = '123';
  const INVALID_ID = 'invalid-id';
  
  const MOCK_PATIENT = new Patient(
    '12345678',
    'John',
    'Doe',
    new Date('1990-01-01'),
    'john@example.com',
    'male',
    VALID_ID
  );

  let mockRepository: jest.Mocked<PatientRepoImplementation>;
  let useCase: DeletePatientUseCase;

  beforeEach(() => {
    mockRepository = {
      delete: jest.fn(),
      findById: jest.fn(),
    } as unknown as jest.Mocked<PatientRepoImplementation>;

    useCase = new DeletePatientUseCase(mockRepository);

    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('Successful deletion', () => {
    it('should return true when patient is successfully deleted', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(MOCK_PATIENT);
      mockRepository.delete.mockResolvedValue(true);

      // Act
      const result = await useCase.execute({ id: VALID_ID });

      // Assert
      expect(result).toBe(true);
      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
      expect(mockRepository.delete).toHaveBeenCalledWith(VALID_ID);
    });
  });

  describe('Input validation', () => {
    it('should throw BadRequest error when ID is missing', async () => {
      // Act & Assert
      try {
        await useCase.execute({ id: undefined });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toContain('ID must be a positive integer');
      }

      // Verify repository methods were not called
      expect(mockRepository.findById).not.toHaveBeenCalled();
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw BadRequest error when ID is invalid', async () => {
      try {
        await useCase.execute({ id: INVALID_ID });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toContain('ID must be a positive integer');
      }

      expect(mockRepository.findById).not.toHaveBeenCalled();
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw BadRequest error when patient data is null', async () => {
      try {
        await useCase.execute(null);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
      }

      expect(mockRepository.findById).not.toHaveBeenCalled();
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should throw NotFound error when patient does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      try {
        await useCase.execute({ id: VALID_ID });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(404);
        expect((error as CustomError).message).toBe('Patient not found');
      }

      expect(mockRepository.findById).toHaveBeenCalledWith(VALID_ID);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      mockRepository.findById.mockRejectedValue(new Error('Database error'));

      try {
        await useCase.execute({ id: VALID_ID });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('Edge cases and data validation', () => {
    it('should validate ID format', async () => {
      try {
        await useCase.execute({ id: INVALID_ID });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toContain('ID must be a positive integer');
      }
      
      // Verify repository methods were not called
      expect(mockRepository.findById).not.toHaveBeenCalled();
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});
