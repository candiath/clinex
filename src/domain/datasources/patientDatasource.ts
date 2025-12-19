import { Patient } from "../entities/patient.entity";
import { EntityID } from "../valueObjects/entityID";

export interface PatientDatasource {
  findById(id: EntityID): Promise<Patient | null>;
  findByDni(dni: string): Promise<Patient | null>;
  save(patient: Patient): Promise<Patient>;
  update(id: EntityID, newPatientData: Patient): Promise<Patient>;
  delete(id: EntityID): Promise<boolean>;
  list(): Promise<Patient[]>;
}