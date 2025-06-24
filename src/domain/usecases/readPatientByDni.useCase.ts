import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../entities/patient";
import { Request } from "express";

export class ReadPatientByDniUseCase {
  constructor( private readonly repository: PatientRepoImplementation ){}

  public async execute( dni: string ): Promise<Patient | null> {
    // if ( data.params ) console.log('TEST: data.params', data.params);
    // if ( data.body ) console.log('TEST: data.body', data.body);
    try {
      if (!dni) {
        throw new Error('DNI parameter is missing');
      }
      console.log('ReadPatientByDniUseCase: dni', dni);
    } catch (error) {
      console.error('Error in ReadPatientByDniUseCase:', error);
      throw new Error('Failed to read patient by DNI');
    }
    console.log('ReadPatientByDniUseCase: dni', dni);
    // console.log('ReadPatientByDniUseCase: dni', dni);
    // console.log('tipo de dni UC:', typeof dni, dni);
    const result = await this.repository.findByDni( dni );
    // console.log('ReadPatientByDniUseCase: result', result);
    return result;
  }
}