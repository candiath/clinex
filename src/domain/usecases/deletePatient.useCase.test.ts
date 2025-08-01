import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { PatientInterface } from "../interfaces/patient.interface";
import { DeletePatientUseCase } from "./deletePatient.useCase";
import { CustomError } from "../errors/customError"; // ✅ ADDED: Import CustomError
import { DeletePatientDTO } from "../dtos/deletePatient.dto";
import { mock } from "node:test";


describe('DeletePatientUseCase', () => {
  const VALID_PATIENT_DNI = '30123456';
  const INVALID_PATIENT_DNI = 'invalid-dni';
  const VALID_PATIENT_DATA: PatientInterface = {
    dni: VALID_PATIENT_DNI, // ✅ FIXED: Consistencia con la constante
    name: 'John',
    surname: 'Doe',
    birthDate: new Date('1990-01-01'),
    email: 'john.doe@example.com',
    // sex: 'male' as const
  };

  let mockRepository: jest.Mocked<PatientRepoImplementation>;
  let useCase: DeletePatientUseCase; // ✅ FIXED: Moved to top level
  let deletePatientDTO: DeletePatientDTO;

  beforeEach(() => {
    mockRepository = {
      delete: jest.fn(), // ✅ FIXED: Correct method name
      exists: jest.fn(), // ✅ FIXED: Added missing method
    } as unknown as jest.Mocked<PatientRepoImplementation>;

    useCase = new DeletePatientUseCase(mockRepository); // ✅ FIXED: Moved here

    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log
  });

  describe('Successful deletion', () => { // ✅ FIXED: Spelling
    it('should return true when patient is successfully deleted', async () => {
      // Arrange
      mockRepository.exists.mockResolvedValue(true);
      mockRepository.delete.mockResolvedValue(true);

      // Act
      const result = await useCase.execute(VALID_PATIENT_DATA);

      // Assert
      expect(result).toBe(true);
      expect(mockRepository.exists).toHaveBeenCalledWith(VALID_PATIENT_DNI);
      expect(mockRepository.delete).toHaveBeenCalledWith(VALID_PATIENT_DNI);
    });
  });

  describe('Input validation', () => {
    it('should throw BadRequest error when DNI is missing', async () => {
      // Arrange
      const invalidPatientData = { ...VALID_PATIENT_DATA, dni: undefined } as any;

      // Act & Assert
      try {
        await useCase.execute(invalidPatientData);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toBe('DNI is not a string');
      }

      // Verify repository methods were not called
      expect(mockRepository.exists).not.toHaveBeenCalled();
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw BadRequest error when DNI is empty string', async () => {
      // Tu implementación aquí
      const invalidPatientData = { ...VALID_PATIENT_DATA, dni: '' } as any;

      try {
        await useCase.execute( invalidPatientData );
        fail('Should have thrown an error');
      } catch ( error ) {
        expect( (error as CustomError) ).toBeInstanceOf( CustomError );
        expect( (error as CustomError).statusCode ).toBe( 400 );
        expect( (error as CustomError).message ).toBe('DNI is not a string');
      }

      expect(mockRepository.exists).not.toHaveBeenCalled();
      expect(mockRepository.delete).not.toHaveBeenCalled();

    });

    it('should throw BadRequest error when DNI format is invalid', async () => {
      // Tu implementación aquí
      const invalidPatientData = { ...VALID_PATIENT_DATA, dni: INVALID_PATIENT_DNI } as any;
      try {
        await useCase.execute(invalidPatientData);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).message).toBe('DNI must contain only numbers');
        expect((error as CustomError).statusCode).toBe(400);
      }
      expect(mockRepository.exists).not.toHaveBeenCalled();
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw BadRequest error when patient data is null', async () => {
      // Tu implementación aquí
      const invalidPatientData = null as any;
      try {
        await useCase.execute(invalidPatientData);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toBe('DNI is missing');
      }
      expect(mockRepository.exists).not.toHaveBeenCalled();
      expect(mockRepository.delete).not.toHaveBeenCalled();

    });
  });

  describe('Error handling', () => {
    it('should throw NotFound error when patient does not exist', async () => {
      // Tu implementación aquí
      mockRepository.exists.mockResolvedValue(false);

      try {
        await useCase.execute(VALID_PATIENT_DATA)
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf( CustomError );
        expect( (error as CustomError).statusCode ).toBe( 404 );
        // expect( (error as CustomError).message ).toBe( )
      }
    })

    it('should throw InternalServerError when repository.exists throws error', async () => {
      // Tu implementación aquí
      mockRepository.exists.mockRejectedValue(new Error('Database error'));
      try {
        await useCase.execute(VALID_PATIENT_DATA);
        fail('Should have thrown an error');
      } catch (error) {
        expect( error ).toBeInstanceOf( CustomError );
        expect( (error as CustomError).statusCode ).toBe( 500 );
        expect( (error as CustomError).message ).toBe('Error checking if patient exists');
      }
    });

    it('should throw InternalServerError when repository.delete returns false', async () => {
      // Tu implementación aquí
      mockRepository.delete.mockReturnValue( Promise.resolve(false) );
      mockRepository.exists.mockResolvedValue(true);
      try {
        await useCase.execute(VALID_PATIENT_DATA);
        fail('Should have thrown an error');
      } catch (error) {
        expect( (error as CustomError).statusCode ).toBe( 500 );
        expect( (error as CustomError).message ).toBe('Error deleting patient');
        expect( error ).toBeInstanceOf( CustomError );
      }
    });

    it('should throw InternalServerError when repository.delete throws error', async () => {
      // Tu implementación aquí
      mockRepository.exists.mockResolvedValue(true);
      mockRepository.delete.mockRejectedValue(new Error('Error deleting patient'));
      try {
        await useCase.execute(VALID_PATIENT_DATA);
        fail('Should have thrown an error');
      } catch (error) {
        expect( error ).toBeInstanceOf( CustomError );
        expect( (error as CustomError).statusCode ).toBe( 500 );
        expect( (error as CustomError).message ).toBe('Error deleting patient');
      }
    });
  });

  describe('Edge cases and data validation', () => {
    it('should handle DNI with leading/trailing spaces', async () => {
      // Tu implementación aquí
      const patientDataWithSpaces = { ...VALID_PATIENT_DATA, dni: '  30123456  ' };
      
      try {
        await useCase.execute(patientDataWithSpaces);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect((error as CustomError).statusCode).toBe(400);
        expect((error as CustomError).message).toBe('DNI must contain only numbers');
      }
      
      // Verify repository methods were not called
      expect(mockRepository.exists).not.toHaveBeenCalled();
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
})