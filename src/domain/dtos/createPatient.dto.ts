
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
    if (!data) {
      console.warn('=> CreatePatientDTO.create called with null or undefined data');
      return ['Patient data is required'];
    }
    if (typeof data !== 'object') {
      console.warn('=> CreatePatientDTO.create called with non-object data');
      return ['Data must be an object'];
    }


    const {dni, firstName, lastName, birthDate, email, sex, } = data;

    // Check what data is missing
    // TODO: improove this validation logic
    // if (!data) return ['Data is required'];
    if (!dni) return ['DNI is required'];
    if (typeof dni !== 'string') return ['DNI must be a string'];
    if (!firstName) return ['First name is required'];
    if (!lastName) return ['Last name is required'];
    if (!birthDate) return ['Date of birth is required'];
    if (!sex) return ['Sex is required'];
    if (typeof birthDate !== 'string') return ['Date of birth must be a string'];
    if (isNaN(Date.parse(birthDate))) return ['Date of birth must be a valid date string'];
    if (email && typeof email !== 'string') return ['Email must be a string'];
    if (sex && typeof sex !== 'string') return ['Sex must be a string'];
    if (sex && !['male', 'female', 'other'].includes(sex)) return ['Sex must be one of: male, female, other'];

    // Convert dateOfBirth to Date object
    // const parsedDate = new Date(dateOfBirth);
    // if (isNaN(parsedDate.getTime())) {
    //   return ['Date of birth must be a valid date'];
    // }


    const patient = new CreatePatientDTO(
      dni,
      firstName,
      lastName,
      new Date(birthDate),
      email ?? '', // email
      sex,
    );

    return [undefined, patient];
  }
}




// export class CreatePatientDTO {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
//   dateOfBirth: Date;

//   constructor(data: Partial<CreatePatientDTO>) {
//     this.firstName = data.firstName || '';
//     this.lastName = data.lastName || '';
//     this.email = data.email || '';
//     this.phoneNumber = data.phoneNumber || '';
//     this.dateOfBirth = data.dateOfBirth || new Date();
//   }
// }