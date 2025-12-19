import { AppointmentStatus } from '../valueObjects/appointmentStatus';
import { EntityID } from '../valueObjects/entityID';
export class Appointment {

  private constructor(
    public patientId: EntityID,
    public doctorId: EntityID,
    public dateTime: Date,
    public status: AppointmentStatus,
    public reason?: string,
    public notes?: string,
    public id?: EntityID,
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
    patientId: EntityID,
    doctorId: EntityID, 
    dateTime: Date,
    status: AppointmentStatus,
    reason?: string,
    notes?: string,
  ): Appointment {
    return new Appointment(patientId, doctorId, dateTime, status, reason, notes);
  }

  static fromDatabase(
    patientId: EntityID,
    doctorId: EntityID,
    dateTime: Date,
    status: AppointmentStatus,
    reason: string,
    notes: string,
    id: EntityID
  ): Appointment {
    return new Appointment(patientId, doctorId, dateTime, status, reason, notes, id);
  }

}
