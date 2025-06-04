import { Patient } from "../entities/patient";

export interface PatientRepository {
  findById(id: string): Promise<Patient | null>;
  findByDni(dni: string): Promise<Patient | null>;
  save(patient: Patient): Promise<void>;
  update(patient: Patient): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  list(): Promise<Patient[]>;
}