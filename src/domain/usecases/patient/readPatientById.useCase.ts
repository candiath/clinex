import { Types } from "mongoose";
import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../../entities/patient";
import { CustomError } from "../../errors/customError";


export class ReadPatientByIdUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(id: string): Promise<Patient | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw CustomError.badRequest('Invalid ID format');
    }

    try {
      const result = await this.repository.findById(id);
      // console.log('ReadPatientByIdUseCase: execute result', result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`==>ReadPatientByIdUseCase: Error fetching patient by ID '${id}':`, errorMessage);

      // Si es un CustomError del dominio, lo preservamos tal como es
      if (error instanceof CustomError) {
        throw error;
      }

      // Manejo específico de errores de Mongoose/MongoDB
      if (error instanceof Error) {
        switch (error.name) {
          case 'MongoNetworkError':
          case 'MongoServerSelectionError':
            console.error('==>Database connection issue:', error.message);
            throw CustomError.internalServerError('Database connection unavailable');
          
          case 'MongoTimeoutError':
            console.error('==>Database timeout:', error.message);
            throw CustomError.internalServerError('Database operation timed out');
          
          case 'CastError':
            console.error('==>Invalid ID format passed validation:', error.message);
            throw CustomError.badRequest('Invalid patient ID format');
          
          case 'ValidationError':
            console.error('==>Database validation error:', error.message);
            throw CustomError.badRequest('Invalid data format');
          
          default:
            // Otros errores de infraestructura
            console.error('==>Unexpected database error:', error.message);
            throw CustomError.internalServerError('Internal database error occurred');
        }
      }
      
      // Para errores completamente desconocidos
      console.error('==>Unknown error type:', error);
      throw CustomError.internalServerError('An unexpected error occurred');
    }
  }
}