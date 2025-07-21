import { DoctorSpecialty } from '../types/doctorSpecialty.type';
import { EntityID } from '../types/entityID.type';

export interface Doctor {
  id?: EntityID;
  name: string;
  specialty: DoctorSpecialty;
  email: string;
  phone: string;
}
