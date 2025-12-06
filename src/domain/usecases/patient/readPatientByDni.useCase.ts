import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../../entities/patient.entity";
import { PatientInterface } from "../../interfaces/patient.interface";

export class ReadPatientByDniUseCase {
  constructor( private readonly repository: PatientRepoImplementation ){}

  public async execute( data: PatientInterface ): Promise<Patient | null> {
    // if ( data.params ) console.log('TEST: data.params', data.params);
    // if ( data.body ) console.log('TEST: data.body', data.body);

    // TODO: sanitize input data

    console.log('ReadPatientByDniUseCase: dni', data.dni);
    try {
      if ( !data.dni ) {
        throw new Error('DNI parameter is missing');
      }
    } catch (error) {
      console.error('Error in ReadPatientByDniUseCase:', error);
      throw new Error('Failed to read patient by DNI');
    }
    // console.log('tipo de dni UC:', typeof dni, dni);
    const result = await this.repository.findByDni( data.dni );
    console.log('ReadPatientByDniUseCase: result', result);
    return result;
  }
}