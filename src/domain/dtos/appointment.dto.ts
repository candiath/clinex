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
    public id?: string
  ) {}

  public static validate(data: {
    [key: string]: any;
  }): [string | null, AppointmentDTO | null] {
    let patientId: EntityID;
    let doctorId: EntityID;
    let status: AppointmentStatus;
    let id: EntityID;
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
