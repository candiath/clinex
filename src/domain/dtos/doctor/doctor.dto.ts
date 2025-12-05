import { DoctorSpecialty } from "../../types/doctorSpecialty.type";
import { ValidationHelper } from "../../helpers/validation.helper";
import { EntityID } from "../../types/entityID.type";


export class DoctorDTO {
  private constructor(
    public name: string,
    public specialty: DoctorSpecialty,
    public email: string,
    public phone: string,
    public id?: EntityID,
  ) {}

  public static validate
  ( data: { [ key: string ]: any } ): [ string | null, DoctorDTO | null ] {

    if ( !data || typeof( data ) != 'object' ) {
      return [ 'DoctorDTO no data provided or wrong format', null ];
    }

    // console.log('Validating DoctorDTO:');
    // console.log({ name: data.name, specialty: data.specialty, email: data.email, phone: data.phone, id: data.id });

    // Validate data types only (not business rules)
    if ( data.name !== undefined && data.name !== null ) {
      // console.log('Validating name:', data.name);
      if ( typeof( data.name )  != 'string' )
        return [ 'DTO: Name must be a string', null ];
    }

    // console.log('Validating specialty: data:', data.specialty);
    // console.log('Validating specialty type:', typeof data.specialty);

    if ( data.specialty !== undefined && data.specialty !== null) {
      // console.log('Validating specialty in dto:', data.specialty);
      if ( !ValidationHelper.isValidMedicalSpecialty( data.specialty ) )
        return [ 'DTO: Specialty must be a valid DoctorSpecialty', null ];
    }

    if ( data.email !== undefined && data.email !== null) {
      // console.log('Validating email in dto:', data.email);
      const emailError = ValidationHelper.validateEmail( data.email );
      if ( emailError ) {
        return [ emailError, null ];
      }
    }

    if ( data.phone !== undefined && data.phone !== null) {
      // console.log('Validating phone in dto:', data.phone);
      const phoneError = ValidationHelper.validatePhone( data.phone );
      if ( phoneError ) {
        return [ phoneError, null ];
      }
    }

    if ( data.id !== undefined && data.id !== null) {
      // console.log('Validating ID:', data.id);
      // console.log(typeof data.id, data.id);
      if ( ValidationHelper.isEntityIDNotValid( data.id ) )
        return [ 'ID must be a valid ID', null ];
    }

    if ( (data.name      === undefined || data.name      === null) 
      && (data.specialty === undefined || data.specialty === null) 
      && (data.email     === undefined || data.email     === null) 
      && (data.phone     === undefined || data.phone     === null)
      && (data.id        === undefined || data.id        === null)) {
      return [ 'At least one field is mandatory', null ];
    }

    return [ null, new DoctorDTO(
      data.name,
      data.specialty,
      data.email,
      data.phone,
      data.id || undefined,
    )];
  }
}