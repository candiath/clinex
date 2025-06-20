import { PatientDatasource } from "../../domain/datasources/patientDatasource";
import { UpdatePatientDTO } from "../../domain/dtos/updatePatient.dto";
import { Patient } from "../../domain/entities/patient";
import { PatientRepository } from "../../domain/repositories/patientRepository";

export class PatientRepoImplementation implements PatientRepository {
  private readonly datasource: PatientDatasource;
  constructor( datasource: PatientDatasource ) {
    this.datasource = datasource;
  }
  findById(id: string): Promise<Patient | null> {
    return this.datasource.findById(id);
  }
  findByDni(dni: string): Promise<Patient | null> {
    return this.datasource.findByDni(dni);
  }
  save(patient: Patient): Promise<Patient | null> {
    return this.datasource.save(patient);
  }
  update(id: string, newPatientData: UpdatePatientDTO): Promise<boolean> {
    return this.datasource.update(id, newPatientData);
  }
  delete(id: string): Promise<boolean> {
    return this.datasource.delete(id);
  }
  list(): Promise<Patient[]> {
    return this.datasource.list()
  }
  exists(dni: string): Promise<boolean> {
    return this.datasource.exists(dni);
  }

}