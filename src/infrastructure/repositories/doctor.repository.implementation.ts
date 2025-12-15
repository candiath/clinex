import { DoctorDatasource } from "../../domain/datasources/doctor.datasource";
import { DoctorDTO } from "../../domain/dtos/doctor/doctor.dto";
import { Doctor } from "../../domain/entities/doctor.entity";
import { DoctorRepository } from "../../domain/repositories/doctorRepository";


export class DoctorRepositoryImplementation implements DoctorRepository {
  private readonly datasource: DoctorDatasource;
  constructor( datasource: DoctorDatasource ) {
    this.datasource = datasource;
  }
  findById(id: number): Promise<Doctor | null> {
    return this.datasource.findById(id);
  }
  findByEmail(email: string): Promise<Doctor | null> {
    return this.datasource.findByEmail(email);
  }
  save(doctor: Doctor): Promise<Doctor | null> {
    return this.datasource.save(doctor);
  }
  update(id: number, newDoctorData: DoctorDTO): Promise<Doctor | null> {
    return this.datasource.update(id, newDoctorData);
  }
  delete(id: number): Promise<boolean> {
    return this.datasource.delete(id);
  }
  list(): Promise<Doctor[]> {
    return this.datasource.list();
  }
  emailExists(email: string): Promise<boolean> {
    return this.datasource.emailExists(email);
  }

}