import { CustomError } from "../errors/customError";
import { AppointmentStatus } from "../types/appointmentStatus.type";


export class AppointmentDTO {
  

  private constructor(
    public patientId: string,
    public doctorId: string,
    public dateTime: Date,
    public status: AppointmentStatus,
    public reason?: string,
    public notes?: string,
    public id?: string,
  ) {}

  public static validate(data: {[key: string]: any}): [string | null, AppointmentDTO | null] {

    if (data.patientId !== undefined && data.patientId !== null) {
      if (typeof data.patientId !== 'string') {
        return ['Patient ID must be a string', null];
      }
    }
    if (data.doctorId !== undefined && data.doctorId !== null) {
      if (typeof data.doctorId !== 'string') {
        return ['Doctor ID must be a string', null];
      }
    }
    if (data.dateTime !== undefined && data.dateTime !== null) {
      if (!(data.dateTime instanceof Date)) {
        return ['Date and time must be a Date object', null];
      }
    }
    if (data.status !== undefined && data.status !== null) {
      if (!Object.values(AppointmentStatus).includes(data.status)) {
        return ['Status must be a valid AppointmentStatus', null];
      }
    }
    if (data.reason !== undefined && data.reason !== null) {
      if (typeof data.reason !== 'string') {
        return ['Reason must be a string', null];
      }
    }
    if (data.notes !== undefined && data.notes !== null) {
      if (typeof data.notes !== 'string') {
        return ['Notes must be a string', null];
      }
    }
    if (data.id !== undefined && data.id !== null) {
      if (typeof data.id !== 'string') {
        return ['ID must be a string', null];
      }
    }

    const dto = new AppointmentDTO(
      data.patientId,
      data.doctorId,
      data.dateTime,
      data.status,
      data.reason,
      data.notes,
      data.id
    );

    return [null, dto];
  }
}