import { PatientDatasource } from "../../domain/datasources/patientDatasource";
import { PatientDTO } from "../../domain/dtos/patient/patient.dto";
import { Patient } from "../../domain/entities/patient.entity";
import { PatientRepository } from "../../domain/repositories/patientRepository";

export class PatientRepoImplementation implements PatientRepository {
  private readonly datasource: PatientDatasource;
  constructor( datasource: PatientDatasource ) {
    this.datasource = datasource;
  }
  findById(id: number): Promise<Patient | null> {
    return this.datasource.findById(id);
  }
  findByDni(dni: string): Promise<Patient | null> {
    return this.datasource.findByDni(dni);
  }
  save(patient: Patient): Promise<Patient | null> {
    return this.datasource.save(patient);
  }
  update(id: number, newPatientData: PatientDTO): Promise<boolean> {
    return this.datasource.update(id, newPatientData);
  }
  delete(id: number): Promise<boolean> {
    return this.datasource.delete(id);
  }
  list(): Promise<Patient[]> {
    return this.datasource.list()
  }
  exists(dni: string): Promise<boolean> {
    return this.datasource.exists(dni);
  }

}