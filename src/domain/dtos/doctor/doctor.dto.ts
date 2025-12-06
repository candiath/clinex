import { DoctorSpecialty } from "../../types/doctorSpecialty.type";
import { ValidationHelper } from "../../helpers/validation.helper";
import { EntityID } from "../../valueObjects/entityID";
import { Email } from "../../valueObjects/email";
import { Phone } from "../../valueObjects/phone";
import { CustomError } from "../../errors/customError";

export class DoctorDTO {
  private constructor(
    public name: string,
    public specialty: DoctorSpecialty,
    public email: Email | null,
    public phone: Phone | null,
    public id?: EntityID
  ) {}

  public static validate(data: {
    [key: string]: any;
  }): [string | null, DoctorDTO | null] {
    if (!data || typeof data != "object") {
      return ["DoctorDTO no data provided or wrong format", null];
    }

    // console.log('Validating DoctorDTO:');
    // console.log({ name: data.name, specialty: data.specialty, email: data.email, phone: data.phone, id: data.id });

    // Validate data types only (not business rules)
    if (data.name !== undefined && data.name !== null) {
      // console.log('Validating name:', data.name);
      if (typeof data.name != "string")
        return ["DTO: Name must be a string", null];
    }

    // console.log('Validating specialty: data:', data.specialty);
    // console.log('Validating specialty type:', typeof data.specialty);

    if (data.specialty !== undefined && data.specialty !== null) {
      // console.log('Validating specialty in dto:', data.specialty);
      if (!ValidationHelper.isValidMedicalSpecialty(data.specialty))
        return ["DTO: Specialty must be a valid DoctorSpecialty", null];
    }

    // TODO: strict type email variable
    let email;
    try {
      ( data.email == null) ? email = null : email = Email.create(data.email);
    } catch (error) {
      return [(error as CustomError).message, null];
    }

    let phone;
    try {
      ( data.phone == null ) ? phone = null : phone = Phone.create(data.phone);
    } catch (error) {
      return [(error as CustomError).message, null];
    }

    let id;
    try {
      if (data.id != null)
      id = EntityID.createOptional(data.id);
    } catch (error) {
      return [(error as CustomError).message, null];
    }

    if (
      (data.name === undefined || data.name === null) &&
      (data.specialty === undefined || data.specialty === null)
    ) {
      return ["At least one field is mandatory", null];
    }

    return [
      null,
      new DoctorDTO(
        data.name,
        data.specialty,
        email,
        phone,
        id ?? undefined
      ),
    ];
  }
}
