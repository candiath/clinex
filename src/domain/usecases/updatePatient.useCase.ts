import { Types } from "mongoose";
import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { UpdatePatientDTO } from "../dtos/updatePatient.dto";
import { Patient } from "../entities/patient";
import { CustomError } from "../errors/customErrors";


export class UpdatePatientUseCase {
  constructor( private readonly repository: PatientRepoImplementation ) {}

  public async execute( id: string, data: { [key: string]: any }): Promise<boolean> {

    // TODO: sanitize id
    if ( !Types.ObjectId.isValid(id) ) {
      throw CustomError.badRequest('Invalid ID format');
    }

    const [ error, updatePatientDTO ] = UpdatePatientDTO.create( data );
    if ( error ) {
      console.error('=> UpdatePatientUseCase: Error creating UpdatePatientDTO:', error);
      throw CustomError.badRequest(error);
    }
    if ( !updatePatientDTO ) {
      console.error('=> UpdatePatientUseCase: No data provided for update');
      throw CustomError.badRequest('No data provided for update');
    }
    console.log('COOL');


    return this.repository.update( id, updatePatientDTO );
  }
}