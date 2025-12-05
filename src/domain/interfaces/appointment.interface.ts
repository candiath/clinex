import { AppointmentStatus } from '../types/appointmentStatus.type';
import { EntityID } from '../valueObjects/entityID';

export interface Appointment {
  id?: EntityID;
  patientId: EntityID;
  doctorId: EntityID;
  dateTime: Date;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
}
