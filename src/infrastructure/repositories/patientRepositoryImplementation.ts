import { PatientDatasource } from "../../domain/datasources/patientDatasource";
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
  save(patient: Patient): Promise<void> {
    return this.datasource.save(patient);
  }
  update(patient: Patient): Promise<void> {
    return this.datasource.update(patient);
  }
  delete(id: string): Promise<void> {
    return this.datasource.delete(id);
  }
  list(): Promise<Patient[]> {
    return this.datasource.list()
  }

}