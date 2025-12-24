import { EntityID } from "../valueObjects/entityID";

export interface PatientInterface {
  dni: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  sex: string;
}

export interface createPatientInput {
  dni: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  sex: string;
}

export interface getPatientByIdInput {
  id: EntityID;
}

export interface updatePatientInput {
  id: EntityID;
  dni?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  email?: string;
  sex?: string;
}

export interface deletePatientInput {
  id: EntityID;
}