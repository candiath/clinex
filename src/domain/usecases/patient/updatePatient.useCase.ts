import { Types } from "mongoose";
import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { UpdatePatientDTO } from "../../dtos/updatePatient.dto";
import { Patient } from "../../entities/patient";
import { CustomError } from "../../errors/customError";
import { PatientInterface } from "../../interfaces/patient.interface";


export class UpdatePatientUseCase {
  constructor( private readonly repository: PatientRepoImplementation ) {}

  public async execute( data: PatientInterface ): Promise<boolean> {

    console.log('UpdatePatientUseCase: execute called with data:', data);
    // data = 
    // TODO: sanitize id
    if ( data.id && !Types.ObjectId.isValid( data.id ) ) {
      throw CustomError.badRequest(`${ data.id } is not a valid ID format`);
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


    return this.repository.update( data.id!, updatePatientDTO );
  }
}