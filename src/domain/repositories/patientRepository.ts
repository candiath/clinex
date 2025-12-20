import { Patient } from "../entities/patient.entity";
import { PatientInterface } from "../interfaces/patient.interfaces";
import { EntityID } from "../valueObjects/entityID";

export interface PatientRepository {
  findById(id: EntityID): Promise<Patient | null>;
  findByDni(dni: string): Promise<Patient | null>;
  save(patient: Patient): Promise<Patient>;
  update(id: EntityID, newPatientData: PatientInterface): Promise<Patient>;
  delete(id: EntityID): Promise<boolean>;
  list(): Promise<Patient[]>;
}