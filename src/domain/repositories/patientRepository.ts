import { PatientDTO } from "../dtos/patient/patient.dto";
import { Patient } from "../entities/patient.entity";
import { EntityID } from "../valueObjects/entityID";

export interface PatientRepository {
  findById(id: EntityID): Promise<Patient | null>;
  findByDni(dni: string): Promise<Patient | null>;
  save(patient: Patient): Promise<Patient | null>;
  update(id: EntityID, newPatientData: PatientDTO): Promise<boolean>;
  delete(id: EntityID): Promise<boolean>;
  list(): Promise<Patient[]>;
  exists(dni: string): Promise<boolean>;
}