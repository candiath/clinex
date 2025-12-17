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

  static create(value: string): AppointmentStatus {
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
