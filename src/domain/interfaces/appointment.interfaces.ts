import { AppointmentStatus } from "../valueObjects/appointmentStatus";
import { EntityID } from "../valueObjects/entityID";

export interface AppointmentInterface {
  id: EntityID;
  patientId: EntityID;
  doctorId: EntityID;
  date: Date;
  status: AppointmentStatus;
}

export interface createAppointmentInput {
  patientId: EntityID;
  doctorId: EntityID;
  date: Date;
  status: AppointmentStatus;
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