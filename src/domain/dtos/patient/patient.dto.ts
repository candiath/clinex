import { CustomError } from "../../errors/customError";
import { ValidationHelper } from "../../helpers/validation.helper";
import { Genres } from "../../types/genres.type";
import { Email } from "../../valueObjects/email";
import { EntityID } from "../../valueObjects/entityID";

export class PatientDTO {
  private constructor(
    public dni: string,
    public firstName: string,
    public lastName: string,
    public birthDate: Date,
    public email: string,
    public sex: string,
    public id?: string,
  ) { }


  static validate(data: { [key: string]: any }): [string | null, PatientDTO | null] {
    if (!data || typeof data !== 'object' && Array.isArray(data) || Object.keys(data).length === 0) {
      return ['PatientDTO no data provided or wrong format', null];
    }

    //TODO: puede ser el dni un numero?
    if (data.dni !== undefined && data.dni !== null) {
      if (typeof data.dni !== 'string')
        return ['DTO: DNI must be a string', null];
    }

    if (data.firstName !== undefined && data.firstName !== null) {
      if (typeof data.firstName !== 'string')
        return ['DTO: First name must be a string', null];
    }

    if (data.lastName !== undefined && data.lastName !== null) {
      if (typeof data.lastName !== 'string')
        return ['DTO: Last name must be a string', null];
    }
    if (data.birthDate !== undefined && data.birthDate !== null) {
      if (typeof data.birthDate !== 'string' && !(data.birthDate instanceof Date))
        return ['DTO: Birth date must be a string or Date', null];
    }

    let email;
    try {
      (data.email == null ) 
        ? email = null
        : ( data.email === "" ) ? email = null : email = Email.create(data.email);
    } catch (error) {
      return [(error as CustomError).message, null];

    }

    // if (data.sex !== undefined && data.sex !== null) {
    //   if ( Object.values(Genres).includes(data.sex))
    //     return ['DTO: Sex must be a string', null];
    // }

    let id;
    try {
      id = EntityID.createOptional(data.id);
    } catch (error) {
      return [(error as CustomError).message, null];

    }

    // Convert birthDate to Date if it's a string
    let birthDate: Date | undefined | null = data.birthDate;
    if (birthDate && !(birthDate instanceof Date)) {
      birthDate = new Date(birthDate as string);
    }

    return [null, new PatientDTO(
      data.dni,
      data.firstName,
      data.lastName,
      birthDate as Date,
      data.email,
      data.sex,
      data.id,
    )];
  }
}