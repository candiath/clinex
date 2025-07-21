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

    // Validate data types only (not business rules)
    if ( data.name !== undefined && typeof( data.name )  != 'string' ) return [ 'Name must be a string', null ];
    if ( ValidationHelper.isValidMedicalSpecialty( data.specialty ) ) return [ 'Specialty must be a valid DoctorSpecialty', null ];
    if ( ValidationHelper.validateEmail( data.email ) ) return [ 'Email must be a valid email format', null ];
    if ( ValidationHelper.validatePhone( data.phone ) ) return [ 'Phone must be a valid phone format', null ];
    if ( ValidationHelper.validateEntityID( data.id ) ) return [ 'ID must be a valid ID', null ];

    return [ null, new DoctorDTO(
      data.name,
      data.specialty,
      data.email,
      data.phone,
      data.id || undefined,
    )];
  }
}