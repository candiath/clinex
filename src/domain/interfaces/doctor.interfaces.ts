import { DoctorSpecialty } from "../types/doctorSpecialty.type";
import { EntityID } from "../valueObjects/entityID";

export interface DoctorInterface {
  name: string;
  specialty: DoctorSpecialty;
  email: string;
  phone: string;
}

export interface createDoctorInput {
  name: string;
  specialty: DoctorSpecialty;
  email: string;
  phone: string;
}

export interface getDoctorByIdInput {
  id: EntityID;
}

export interface updateDoctorInput {
  id: EntityID;
  name?: string;
  specialty?: DoctorSpecialty;
  email?: string;
  phone?: string;
}

export interface deleteDoctorInput {
  id: EntityID;
}
