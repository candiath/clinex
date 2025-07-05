import { PatientInterface } from "../interfaces/patient.interface";


export class DeletePatientDTO {

  public readonly dni: string;
  private constructor(dni: string) {
    this.dni = dni;
  }

  static create( data: PatientInterface ): [error?: string, DeletePatientDTO?] {
    // Verificar que sea string y no esté vacío
    if (data === null || data === undefined) {
      return ['DNI is missing', undefined];
    }
    if (typeof data.dni !== 'string' || data.dni === '') {
      return ['DNI is not a string', undefined];
    }

    // Verificar que solo contenga números (dígitos 0-9)
    const dniRegex = /^\d+$/;
    if (!dniRegex.test(data.dni)) {
      return ['DNI must contain only numbers', undefined];
    }

    // TODO: validar que un DNI extranjero puede tener un formato distinto
    return [undefined, new DeletePatientDTO(data.dni)];
  }
}