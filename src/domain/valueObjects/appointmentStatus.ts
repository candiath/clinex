import { CustomError } from "../errors/customError";
import { AppointmentStatusSchema } from "../interfaces/dataSchemas.interfaces";

export enum AppointmentStatusValues {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export class AppointmentStatus {
  private constructor(
    private readonly value: AppointmentStatusValues
  ) {}

  static validate( value: string ): AppointmentStatus {
    const parsedData = AppointmentStatusSchema.safeParse( value );
    if (!parsedData.success) throw CustomError.badRequest(parsedData.error.message, {location: "AppointmentStatus: validate"});
    return new AppointmentStatus(parsedData.data as AppointmentStatusValues)
  }

  static create(value: string): AppointmentStatus {
    console.log({value});
    const test = Object.values(AppointmentStatusValues).includes(
      value as AppointmentStatusValues
    );

    if (test) return new AppointmentStatus(value as AppointmentStatusValues);
    throw "Appointment status is not valid";
  }

  public static includes(value: string | AppointmentStatus): boolean {
    return Object.values(AppointmentStatusValues).includes(
      value as AppointmentStatusValues
    );
  }

  getValue(): string {
    return this.value.toString();
  }
}
