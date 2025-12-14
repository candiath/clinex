import { EntityID } from "../valueObjects/entityID";

export class Patient {
  constructor(
    public dni: string,
    public firstName: string,
    public lastName: string,
    public birthDate: Date,
    public email: string,
    public sex: string,
    public id?: EntityID,
  ) {
    this.dni = dni;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.email = email;
    this.sex = sex;
    this.id = id;
  }

  public static readonly mandatoryFields = ['dni', 'firstName', 'lastName', 'birthDate', 'sex'];
  
  static create( dni: string, firstName: string, lastName: string, birthDate: Date, email: string, sex: string): Patient {
    return new Patient(dni, firstName, lastName, birthDate, email, sex);
  }

  static fromDatabase( dni: string, firstName: string, lastName: string, birthDate: Date, email: string, sex: string, id: string ): Patient {
    //!  This method asumes that database IDs are always valid,
    //!  therefore this may not be the best approach.
    // TODO: issue #30
    return new Patient(dni, firstName, lastName, birthDate, email, sex, EntityID.create(id));
  }

  static getMandatoryFields(): string[] {
    return this.mandatoryFields;
  }
  
}