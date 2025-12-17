import { AppointmentDTO } from "../dtos/appointment/appointment.dto";
import { Appointment } from "../entities/appointment.entity";

export interface AppointmentRepository {

  create(appointment: Appointment): Promise<Appointment | null>;
  getAll(): Promise<Appointment[] | null>;
  getById(id: number): Promise<Appointment | null>;
  update(id: number, appointment: AppointmentDTO): Promise<Appointment | null>;
  delete(id: number): Promise<boolean>;
}