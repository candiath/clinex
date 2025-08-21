import { Appointment } from "../entities/appointment.entity";
import { EntityID } from "../valueObjects/entityID";

export interface AppointmentRepository {

  create(appointment: Appointment): Promise<Appointment | null>;
  getAll(): Promise<Appointment[] | null>;
  getById(id: EntityID): Promise<Appointment | null>;
  update(appointment: Appointment): Promise<Appointment | null>;
  delete(id: EntityID): Promise<boolean>;
}