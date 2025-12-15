import { DoctorDTO } from "../dtos/doctor/doctor.dto";
import { Doctor } from "../entities/doctor.entity";

export interface DoctorDatasource {
  findById( id: number ): Promise<Doctor | null>;
  findByEmail( email: string ): Promise<Doctor | null>;
  save( doctor: Doctor ): Promise<Doctor | null>;
  update( id: number, newDoctorData: DoctorDTO ): Promise<Doctor | null>;
  delete( id: number ): Promise<boolean>;
  list(): Promise<Doctor[]>;
  emailExists( email: string ): Promise<boolean>;
}