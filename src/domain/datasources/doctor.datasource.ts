import { DoctorDTO } from "../dtos/doctor/doctor.dto";
import { Doctor } from "../interfaces/doctor.interface";
import { EntityID } from "../types/entityID.type";

export interface DoctorDatasource {
  findById( id: string ): Promise<Doctor | null>;
  findByEmail( email: string ): Promise<Doctor | null>;
  save( doctor: Doctor ): Promise<Doctor | null>;
  update( id: EntityID, newDoctorData: DoctorDTO ): Promise<Doctor | null>;
  delete( id: string ): Promise<boolean>;
  list(): Promise<Doctor[]>;
  emailExists( email: string ): Promise<boolean>;
}