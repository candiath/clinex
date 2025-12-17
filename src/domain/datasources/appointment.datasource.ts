import { Appointment } from "../entities/appointment.entity";
export interface AppointmentDatasource {

  create(appointment: Appointment): Promise<Appointment | null>;
  getAll(): Promise<Appointment[] | null>;
  getById(id: number): Promise<Appointment | null>;
  update(id: number, appointment: Appointment): Promise<Appointment | null>;
  delete(id: number): Promise<boolean>;
}