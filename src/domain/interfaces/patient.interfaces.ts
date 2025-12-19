import { EntityID } from "../valueObjects/entityID";

export interface PatientInterface {
  id: EntityID;
  dni: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  sex: string;
  phoneNumber: string;
}

export interface createPatientInput {
  dni: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  sex: string;
  phoneNumber: string;
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
  phoneNumber?: string;
}

export interface deletePatientInput {
  id: EntityID;
}