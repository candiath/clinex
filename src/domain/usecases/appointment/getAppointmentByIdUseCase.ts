import { AppointmentRepository } from "../../repositories/appointment.repository";
import { EntityID } from "../../valueObjects/entityID";

export class GetAppointmentByIdUseCase {

  public readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  public async execute (id: EntityID) {

    return this.repository.getById(id);
  }
}