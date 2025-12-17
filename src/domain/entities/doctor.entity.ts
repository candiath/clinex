import { DoctorSpecialty } from '../types/doctorSpecialty.type'

export class Doctor {

  private constructor(
    public name: string, 
    public specialty: DoctorSpecialty, 
    public email: string, 
    public phone: string,
    public id?: number, 
  ) {
    this.name = name;
    this.specialty = specialty;
    this.email = email;
    this.phone = phone;
    this.id = id;
  }

  public static readonly mandatoryFields = ['name', 'specialty', 'email', 'phone'];

  static create( name: string, specialty: DoctorSpecialty, email: string, phone: string, id?: number ): Doctor {
    return new Doctor(name, specialty, email, phone, id);
  }

  static fromDatabase( name: string, specialty: DoctorSpecialty, email: string, phone: string, id: number ): Doctor {
    // TODO: issue #30
    return new Doctor(name, specialty, email, phone, id);
  }

  static getMandatoryFields(): string[] {
    return this.mandatoryFields;
  }
  
}