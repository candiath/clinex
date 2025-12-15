import { DoctorSpecialty } from '../types/doctorSpecialty.type';
import { EntityID } from '../valueObjects/entityID';
import { Phone } from '../valueObjects/phone';

export interface Doctor {
  id?: EntityID;
  name: string;
  specialty: DoctorSpecialty;
  email: string;
  phone: Phone;
}
