
export class CreatePatientDTO {

  private constructor(
    public readonly dni: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly birthDate: Date,
    public readonly email: string,
    public readonly sex: 'male' | 'female' | 'other',
    public readonly id?: string,
  ) {}

  static create( data: { [key: string]: any }): [ string?, CreatePatientDTO? ] {
    // TODO:
    if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).length === 0) {
      console.error('=> CreatePatientDTO.create called with invalid or empty data');
      return ['No patient data provided', undefined];
    }
    // TODO: is it possible to pass a non-object data?
    // if (typeof data !== 'object') {
    //   console.warn('=> CreatePatientDTO.create called with non-object data');
    //   return ['Data must be an object'];
    // }


    const {dni, firstName, lastName, birthDate, email, sex, } = data;

    // Check what data is missing
    // TODO: improove this validation logic
    // if (!dni) return ['DNI is required', undefined];
    if (dni       !== undefined && typeof dni       !== 'string') return ['DNI must be a string', undefined];
    if (firstName !== undefined && typeof firstName !== 'string') return ['First name must be a string', undefined];
    if (lastName  !== undefined && typeof lastName  !== 'string') return ['Last name must be a string', undefined];
    if (sex       !== undefined && typeof sex       !== 'string') return ['Sex must be a string', undefined];
    if (email     !== undefined && typeof email     !== 'string') return ['Email must be a string', undefined];
    if (birthDate !== undefined ) {
      if ( typeof birthDate !== 'string' ) return ['Date of birth must be a string', undefined];
      if ( isNaN(Date.parse(birthDate)) ) return ['Date of birth must be a valid date string', undefined];
    }

    // TODO: validate email format
    // if (sex && !['male', 'female', 'other'].includes(sex)) return ['Sex must be one of: male, female, other', undefined];

    const patientDTO = new CreatePatientDTO(
      dni,
      firstName,
      lastName,
      (birthDate) ? (birthDate) : undefined, // TODO: check for optimization
      email,
      sex,
    );

    return [undefined, patientDTO];
  }
}