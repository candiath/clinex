import { PatientDTO } from "../dtos/patient/patient.dto";
import { Patient } from "../entities/patient.entity";

export interface PatientDatasource {
  findById(id: string): Promise<Patient | null>;
  findByDni(dni: string): Promise<Patient | null>;
  save(patient: Patient): Promise<Patient | null>;
  update(id: string, newPatientData: PatientDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  list(): Promise<Patient[]>;
  exists(dni: string): Promise<boolean>;
}