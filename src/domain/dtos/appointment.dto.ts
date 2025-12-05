import { AppointmentStatus } from "../valueObjects/appointmentStatus";
import { EntityID } from "../valueObjects/entityID";

export class AppointmentDTO {
  private constructor(
    public patientId: EntityID | undefined,
    public doctorId: EntityID | undefined,
    public dateTime: Date | undefined,
    public status: AppointmentStatus | undefined,
    // public reason?: string,
    // public notes?: string,
    public id?: EntityID
  ) {}

  public static validate(data: {
    [key: string]: any;
  }): [string | null, AppointmentDTO | null] {
    let patientId: EntityID | undefined;
    let doctorId: EntityID | undefined;
    let status: AppointmentStatus | undefined;
    let id: EntityID | undefined;
    let dateTime: Date | undefined;

    // Validar patientId solo si está presente
    if (this.hasProp(data, 'patientId')) {
      try {
        patientId = EntityID.create(data.patientId);
      } catch (error) {
        return ["Invalid patientId: " + (error as Error).message, null];
      }
    }

    // Validar doctorId solo si está presente
    if (this.hasProp(data, 'doctorId')) {
      try {
        doctorId = EntityID.create(data.doctorId);
      } catch (error) {
        return ["Invalid doctorId: " + (error as Error).message, null];
      }
    }

    // Validar status solo si está presente
    if (this.hasProp(data, 'status')) {
      try {
        status = AppointmentStatus.create(data.status);
      } catch (error) {
        return ["Invalid status: " + (error as Error).message, null];
      }
    }

    // Validar dateTime solo si está presente
    if (this.hasProp(data, 'dateTime')) {
      const date = new Date(data.dateTime);
      if (isNaN(date.getTime())) {
        return ["Invalid dateTime: must be a valid date", null];
      }
      dateTime = date;
    }

    // Validar id solo si está presente
    if (this.hasProp(data, 'id') && data.id !== null) {
      try {
        id = EntityID.create(data.id);
      } catch (error) {
        return ["Invalid id: " + (error as Error).message, null];
      }
    }

    // Validar reason solo si está presente
    if (this.hasProp(data, 'reason') && data.reason !== null) {
      if (typeof data.reason !== 'string') {
        return ["Invalid reason: must be a string", null];
      }
    }

    // Validar notes solo si está presente
    if (this.hasProp(data, 'notes') && data.notes !== null) {
      if (typeof data.notes !== 'string') {
        return ["Invalid notes: must be a string", null];
      }
    }

    const dto = new AppointmentDTO(
      patientId,
      doctorId,
      dateTime,
      status,
      // data.reason,
      // data.notes,
      id
    );

    return [null, dto];
  }

  // Helper para verificar propiedades de forma segura
  private static hasProp(obj: any, prop: string): boolean {
    return obj != null && Object.prototype.hasOwnProperty.call(obj, prop);
  }
}
