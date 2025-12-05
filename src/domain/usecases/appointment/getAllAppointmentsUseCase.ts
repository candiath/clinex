import { AppointmentRepository } from "../../repositories/appointment.repository";


export class GetAllAppointmentsUseCase {

  public readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }
  //todo: decidir si execute necesita alguna data o no
  public async execute () {

    return this.repository.getAll();

  }
}