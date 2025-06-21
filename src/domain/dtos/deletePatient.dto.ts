

export class DeletePatientDTO {

  public readonly dni: string;
  private constructor(dni: string) {
    this.dni = dni;
  }

  static create( data: {[ key: string ]: any }): [error?: string, DeletePatientDTO?] {
    // TODO: validar que un DNI extranjero puede tener un formato distinto
    if ( typeof data.params.dni === 'string' && data.params.dni !== '' ) {
      return [undefined, new DeletePatientDTO(data.params.dni)];
    } else {
      return [ 'DNI is not an string', undefined];
    }
  }
}