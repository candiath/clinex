import { Appointment } from "../entities/appointment.entity";
import { EntityID } from "../valueObjects/entityID";
export interface AppointmentDatasource {

  create(appointment: Appointment): Promise<Appointment>;
  getAll(): Promise<Appointment[]>;
  getById(id: EntityID): Promise<Appointment | null>;
  update(id: EntityID, appointment: Appointment): Promise<Appointment>;
  delete(id: EntityID): Promise<boolean>;
}