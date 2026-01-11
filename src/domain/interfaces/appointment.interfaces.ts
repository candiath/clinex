import { EntityID } from "../valueObjects/entityID";

export interface AppointmentInterface {
  id: EntityID;
  patientId: EntityID;
  doctorId: EntityID;
  dateTime: Date;
  status: string;
  reason?: string;
  notes?: string;
}

export interface createAppointmentInput {
  patientId: EntityID;
  doctorId: EntityID;
  dateTime: Date;
  status: string;
}

export interface getAppointmentByIdInput {
  id: EntityID;
}

export interface updateAppointmentInput {
  id: EntityID;
  patientId?: EntityID;
  doctorId?: EntityID;
  appointmentDate?: Date;
}

export interface deleteAppointmentInput {
  id: EntityID;
} 