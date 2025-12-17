import { PatientDTO } from "../dtos/patient/patient.dto";
import { Patient } from "../entities/patient.entity";

export interface PatientDatasource {
  findById(id: number): Promise<Patient | null>;
  findByDni(dni: string): Promise<Patient | null>;
  save(patient: Patient): Promise<Patient | null>;
  update(id: number, newPatientData: PatientDTO): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  list(): Promise<Patient[]>;
  exists(dni: string): Promise<boolean>;
}