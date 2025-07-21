import { DoctorSpecialty } from '../types/doctorSpecialty.type'

export class Doctor {

  private constructor(
    public name: string, 
    public specialty: DoctorSpecialty, 
    public email: string, 
    public phone: string,
    public id?: string, 
  ) {
    this.name = name;
    this.specialty = specialty;
    this.email = email;
    this.phone = phone;
    this.id = id;
  }

  static create( name: string, specialty: DoctorSpecialty, email: string, phone: string, id?: string ): Doctor {
    return new Doctor(name, specialty, email, phone, id);
  }

  static fromDatabase( name: string, specialty: DoctorSpecialty, email: string, phone: string, id: string ): Doctor {
    return new Doctor(name, specialty, email, phone, id);
  }
}