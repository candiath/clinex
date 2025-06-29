import { PatientInterface } from "../interfaces/patient.interface";


export class DeletePatientDTO {

  public readonly dni: string;
  private constructor(dni: string) {
    this.dni = dni;
  }

  static create( data: PatientInterface ): [error?: string, DeletePatientDTO?] {
    // TODO: validar que un DNI extranjero puede tener un formato distinto
    if ( typeof data.dni === 'string' && data.dni !== '' ) {
      return [undefined, new DeletePatientDTO(data.dni)];
    } else {
      return [ 'DNI is not an string', undefined];
    }
  }
}