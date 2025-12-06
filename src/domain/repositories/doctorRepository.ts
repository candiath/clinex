import { DoctorDTO } from "../dtos/doctor/doctor.dto";
import { Doctor } from "../entities/doctor.entity";
import { Email } from "../valueObjects/email";
import { EntityID } from "../valueObjects/entityID";

export interface DoctorRepository {
  findById(id: EntityID): Promise<Doctor | null>;
  findByEmail(email: Email): Promise<Doctor | null>;
  save(doctor: Doctor): Promise<Doctor | null>;
  update(id: EntityID, newDoctorData: DoctorDTO): Promise<Doctor | null>;
  delete(id: EntityID): Promise<boolean>;
  list(): Promise<Doctor[]>;
  emailExists(email: Email): Promise<boolean>;
}
