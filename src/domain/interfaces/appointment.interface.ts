import { AppointmentStatus } from '../types/appointmentStatus.type';
import { EntityID } from '../types/entityID.type';

export interface Appointment {
  id?: EntityID;
  patientId: string;
  doctorId: string;
  dateTime: Date;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
}
