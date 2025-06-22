import { Types } from "mongoose";
import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../entities/patient";
import { CustomError } from "../errors/customErrors";


export class ReadPatientByIdUseCase {
  constructor( private readonly repository: PatientRepoImplementation ) {}

  public async execute ( id: string ): Promise<Patient | null> {
    let result;
    if ( !Types.ObjectId.isValid(id) ) {
      throw CustomError.badRequest('Invalid ID format');
    } 
    try {
      result = await this.repository.findById( id );
      console.log('ReadPatientByIdUseCase: execute result', result);
    } catch (error) {
      if ( error instanceof CustomError ) {
        throw CustomError.internalServerError('Error fetching patient by ID');
      } else if ( error instanceof Error ) {
        throw CustomError.internalServerError('Error fetching patient by ID');
      } else {
        throw CustomError.internalServerError('Error fetching patient by ID');
      }
    }
    if ( result ) {
    } else {
    }
    return await this.repository.findById( id );
  }
}