import { DoctorDTO } from "../dtos/doctor/doctor.dto";
import { Doctor } from "../entities/doctor.entity";
import { EntityID } from "../types/entityID.type";

export interface DoctorRepository {
  findById(id: EntityID): Promise<Doctor | null>;
  findByEmail(email: string): Promise<Doctor | null>;
  save(doctor: Doctor): Promise<Doctor | null>;
  update(id: EntityID, newDoctorData: DoctorDTO): Promise<Doctor | null>;
  delete(id: EntityID): Promise<boolean>;
  list(): Promise<Doctor[]>;
  emailExists(email: string): Promise<boolean>;
}
