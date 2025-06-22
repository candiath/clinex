import { PatientRepoImplementation } from "../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../entities/patient";
import { Request } from "express";

export class ReadPatientByDniUseCase {
  constructor( private readonly repository: PatientRepoImplementation ){}

  public async execute( data: Request ): Promise<Patient | null> {
    let dni: string;
    if ( data.params ) console.log('TEST: data.params', data.params);
    if ( data.body ) console.log('TEST: data.body', data.body);
    try {
      if (!data || !data.params.dni && !data.body.dni) {
        throw new Error('DNI parameter is missing');
      }
      console.log('ReadPatientByDniUseCase: data.params.dni', data.params.dni);
      // console.log('ReadPatientByDniUseCase: data.body.dni', data.body.dni);
      console.log(typeof data.params.dni, data.params.dni);
      // console.log(typeof data.body.dni, data.body.dni);
      console.log('hola');
      ( data.body && data.body.dni )
        ? dni = data.body.dni
        : dni = data.params.dni;
      console.log('espludio');
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