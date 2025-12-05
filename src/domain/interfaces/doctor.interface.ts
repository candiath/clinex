import { DoctorSpecialty } from '../types/doctorSpecialty.type';
import { Email } from '../valueObjects/email';
import { EntityID } from '../valueObjects/entityID';
import { Phone } from '../valueObjects/phone';

export interface Doctor {
  id?: EntityID;
  name: string;
  specialty: DoctorSpecialty;
  email: Email;
  phone: Phone;
}
