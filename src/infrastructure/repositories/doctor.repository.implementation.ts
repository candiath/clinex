import { DoctorDatasource } from "../../domain/datasources/doctor.datasource";
import { Doctor } from "../../domain/entities/doctor.entity";
import { DoctorRepository } from "../../domain/repositories/doctorRepository";
import { EntityID } from "../../domain/valueObjects/entityID";


export class DoctorRepositoryImplementation implements DoctorRepository {
  private readonly datasource: DoctorDatasource;
  constructor( datasource: DoctorDatasource ) {
    this.datasource = datasource;
  }
  findById(id: EntityID): Promise<Doctor | null> {
    return this.datasource.findById(id);
  }
  findByEmail(email: string): Promise<Doctor | null> {
    return this.datasource.findByEmail(email);
  }
  save(doctor: Doctor): Promise<Doctor> {
    return this.datasource.save(doctor);
  }
  update(id: EntityID, newDoctorData: Doctor): Promise<Doctor> {
    return this.datasource.update(id, newDoctorData);
  }
  delete(id: EntityID): Promise<boolean> {
    return this.datasource.delete(id);
  }
  list(): Promise<Doctor[]> {
    return this.datasource.list();
  }
  emailExists(email: string): Promise<boolean> {
    return this.datasource.emailExists(email);
  }

}