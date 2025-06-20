import { UpdatePatientDTO } from "../dtos/updatePatient.dto";
import { Patient } from "../entities/patient";

export interface PatientDatasource {
  findById(id: string): Promise<Patient | null>;
  findByDni(dni: string): Promise<Patient | null>;
  save(patient: Patient): Promise<Patient | null>;
  update(id: string, newPatientData: UpdatePatientDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  list(): Promise<Patient[]>;
  exists(dni: string): Promise<boolean>;
}