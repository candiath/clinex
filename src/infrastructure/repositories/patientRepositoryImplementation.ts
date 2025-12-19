import { PatientDatasource } from "../../domain/datasources/patientDatasource";
import { Patient } from "../../domain/entities/patient.entity";
import { PatientInterface } from "../../domain/interfaces/patient.interfaces";
import { PatientRepository } from "../../domain/repositories/patientRepository";
import { EntityID } from "../../domain/valueObjects/entityID";

export class PatientRepoImplementation implements PatientRepository {
  private readonly datasource: PatientDatasource;
  constructor( datasource: PatientDatasource ) {
    this.datasource = datasource;
  }
  findById(id: EntityID): Promise<Patient | null> {
    return this.datasource.findById(id);
  }
  findByDni(dni: string): Promise<Patient | null> {
    return this.datasource.findByDni(dni);
  }
  save(patient: Patient): Promise<Patient> {
    return this.datasource.save(patient);
  }
  update(id: EntityID, newPatientData: PatientInterface): Promise<Patient> {
    return this.datasource.update(id, newPatientData);
  }
  delete(id: EntityID): Promise<boolean> {
    return this.datasource.delete(id);
  }
  list(): Promise<Patient[]> {
    return this.datasource.list()
  }
}