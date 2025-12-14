import { DoctorSpecialty } from '../types/doctorSpecialty.type'
import { Email } from '../valueObjects/email';
import { EntityID } from '../valueObjects/entityID';
import { Phone } from '../valueObjects/phone';

export class Doctor {

  private constructor(
    public name: string, 
    public specialty: DoctorSpecialty, 
    public email: Email, 
    public phone: Phone,
    public id?: EntityID, 
  ) {
    this.name = name;
    this.specialty = specialty;
    this.email = email;
    this.phone = phone;
    this.id = id;
  }

  public static readonly mandatoryFields = ['name', 'specialty', 'email', 'phone'];

  static create( name: string, specialty: DoctorSpecialty, email: Email, phone: Phone, id?: EntityID ): Doctor {
    return new Doctor(name, specialty, email, phone, id);
  }

  static fromDatabase( name: string, specialty: DoctorSpecialty, email: Email, phone: Phone, id: EntityID ): Doctor {
    // TODO: issue #30
    return new Doctor(name, specialty, email, phone, id);
  }

  static getMandatoryFields(): string[] {
    return this.mandatoryFields;
  }
  
}