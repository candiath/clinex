import { AppointmentStatus } from '../valueObjects/appointmentStatus';
export class Appointment {

  private constructor(
    public patientId: number,
    public doctorId: number,
    public dateTime: Date,
    public status: AppointmentStatus,
    public reason?: string,
    public notes?: string,
    public id?: number,
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
    patientId: number,
    doctorId: number, 
    dateTime: Date,
    status: AppointmentStatus,
    reason?: string,
    notes?: string,
  ): Appointment {
    return new Appointment(patientId, doctorId, dateTime, status, reason, notes);
  }

  static fromDatabase(
    patientId: number,
    doctorId: number,
    dateTime: Date,
    status: AppointmentStatus,
    reason: string,
    notes: string,
    id: number
  ): Appointment {
    return new Appointment(patientId, doctorId, dateTime, status, reason, notes, id);
  }

}
