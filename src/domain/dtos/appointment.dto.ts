import { AppointmentStatus } from "../valueObjects/appointmentStatus";
import { EntityID } from "../valueObjects/entityID";


export class AppointmentDTO {
  

  private constructor(
    public patientId: EntityID,
    public doctorId: EntityID,
    public dateTime: Date,
    public status: AppointmentStatus,
    public reason?: string,
    public notes?: string,
    public id?: string,
  ) {}

  public static validate(data: {[key: string]: any}): [string | null, AppointmentDTO | null] {

    let patientId: EntityID;
    let doctorId: EntityID;
    let status: AppointmentStatus;
    let id: EntityID
    try {
      patientId = EntityID.create(data.patientId);
    } catch (error) {
      return ["Invalid patientId: " + (error as Error).message, null];
    }

    try {
      doctorId = EntityID.create(data.doctorId);
    } catch (error) {
      return ["Invalid doctorId: " + (error as Error).message, null];
    }

    try {
      status = AppointmentStatus.create(data.status);
    } catch (error) {
      return ["Invalid status: " + (error as Error).message, null];
    }

    try {
      id = EntityID.create(data.id);
    } catch (error) {
      return ["Invalid id: " + (error as Error).message, null];
    }
    
    
    // if (data.patientId !== undefined && data.patientId !== null) {
    //   if (typeof data.patientId !== 'string') {
    //     return ['Patient ID must be a string', null];
    //   }
    // }
    // if (data.doctorId !== undefined && data.doctorId !== null) {
    //   if (typeof data.doctorId !== 'string') {
    //     return ['Doctor ID must be a string', null];
    //   }
    // }
    // if (data.dateTime !== undefined && data.dateTime !== null) {
    //   if (!isNaN(new Date(data.dateTime).getTime())) {
    //     // return ['Date and time must be a valid Date', null];
        
    //   }
    // }
    // if (data.status !== undefined && data.status !== null) {
    //   if (!Object.values(AppointmentStatus).includes(data.status)) {
    //     return ['Status must be a valid AppointmentStatus', null];
    //   }
    // }
    // if (data.reason !== undefined && data.reason !== null) {
    //   if (typeof data.reason !== 'string') {
    //     return ['Reason must be a string', null];
    //   }
    // }
    // if (data.notes !== undefined && data.notes !== null) {
    //   if (typeof data.notes !== 'string') {
    //     return ['Notes must be a string', null];
    //   }
    // }
    // if (data.id !== undefined && data.id !== null) {
    //   if (typeof data.id !== 'string') {
    //     return ['ID must be a string', null];
    //   }
    // }

    const dto = new AppointmentDTO(
      patientId,
      doctorId,
      data.dateTime,
      status,
      data.reason,
      data.notes,
      id.getValue()
    );

    return [null, dto];
  }
}