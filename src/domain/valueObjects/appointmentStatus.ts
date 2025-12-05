enum Statuses {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export class AppointmentStatus {
  private constructor(private readonly value: any) {}

  static create(value: any): AppointmentStatus {
    const test = Object.values( Statuses ).includes( value );

    if ( test ) return new AppointmentStatus(value);
    throw 'Appointment status is not valid';
  }

  getValue(): any {
    return this.value;
  }
}

