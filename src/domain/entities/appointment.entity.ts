import { AppointmentStatus } from '../types/appointmentStatus.type';

export class Appointment {

  private constructor(
    public patientId: string,
    public doctorId: string,
    public dateTime: Date,
    public status: AppointmentStatus,
    public reason?: string,
    public notes?: string,
    public id?: string,
  ) {
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.dateTime = dateTime;
    this.status = status;
    this.reason = reason;
    this.notes = notes;
    this.id = id;
  }


  static create(
    patientId: string,
    doctorId: string, 
    dateTime: Date,
    status: AppointmentStatus,
    reason?: string,
    notes?: string,
  ): Appointment {
    return new Appointment(patientId, doctorId, dateTime, status, reason, notes);
  }

  static fromDatabase(
    patientId: string,
    doctorId: string,
    dateTime: Date,
    status: AppointmentStatus,
    reason: string,
    notes: string,
    id: string
  ): Appointment {
    return new Appointment(patientId, doctorId, dateTime, status, reason, notes, id);
  }

}
