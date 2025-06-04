import { Patient } from "../entities/patient";

export interface PatientDatasource {
  findById(id: string): Promise<Patient | null>;
  findByDni(dni: string): Promise<Patient | null>;
  save(patient: Patient): Promise<void>;
  update(patient: Patient): Promise<void>;
  delete(id: string): Promise<void>;
  list(): Promise<Patient[]>;
}