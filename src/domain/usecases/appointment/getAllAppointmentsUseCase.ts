import { AppointmentRepository } from "../../repositories/appointment.repository";


export class GetAllAppointmentsUseCase {

  public readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }
  public async execute () {

    // TODO: try catch?
    return this.repository.getAll();

  }
}