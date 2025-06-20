

export class UpdatePatientDTO {

  private constructor(
    public readonly dni?: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly birthDate?: Date,
    public readonly email?: string,
    public readonly sex?: string,
  ) {}


  static create( data: { [key: string]: any }): [ string?, UpdatePatientDTO? ] {
    let dni: string | undefined;
    let firstName: string | undefined;
    let lastName: string | undefined;
    let birthDate: Date | undefined;
    let email: string | undefined;
    let sex: string | undefined;
    try {
      dni = data.dni ? data.dni : undefined;
      firstName = data.firstName ? data.firstName : undefined;
      lastName = data.lastName ? data.lastName : undefined;
      birthDate = data.birthDate ? new Date(data.birthDate) : undefined;
      email = data.email ? data.email : undefined;
      sex = data.sex ? data.sex : undefined;
    } catch (error) {
      console.error('=> Update Patient DTO: Error creating UpdatePatientDTO:', error);
      return [ 'Invalid data format', undefined ];
    }
    if (!dni && !firstName && !lastName && !birthDate && !email && !sex) {
      return [ 'No data', undefined ];
    }
    return [ undefined, new UpdatePatientDTO(dni, firstName, lastName, birthDate, email, sex) ];
  }
}