import { AppointmentDatasource } from "../../domain/datasources/appointment.datasource";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { EntityID } from "../../domain/valueObjects/entityID";

export class AppointmentRepositoryImplementation implements AppointmentRepository {

  private readonly datasource: AppointmentDatasource;
  constructor(datasource: AppointmentDatasource) {
    this.datasource = datasource;
  }
  create(appointment: Appointment): Promise<Appointment> {
    return this.datasource.create(appointment);
  }
  getAll(): Promise<Appointment[]> {
    return this.datasource.getAll();
  }
  getById(id: EntityID): Promise<Appointment | null> {
    return this.datasource.getById(id);
  }
  update(id: EntityID, appointment: Appointment): Promise<Appointment> {
    return this.datasource.update(id, appointment);
  }
  delete(id: EntityID): Promise<boolean> {
    return this.datasource.delete(id);
  }
}