import { Doctor } from "../entities/doctor.entity";
import { EntityID } from "../valueObjects/entityID";

export interface DoctorRepository {
  findById(id: EntityID): Promise<Doctor | null>;
  findByEmail(email: string): Promise<Doctor | null>;
  save(doctor: Doctor): Promise<Doctor>;
  update(id: EntityID, newDoctorData: Doctor): Promise<Doctor>;
  delete(id: EntityID): Promise<boolean>;
  list(): Promise<Doctor[]>;
  emailExists(email: string): Promise<boolean>;
}
