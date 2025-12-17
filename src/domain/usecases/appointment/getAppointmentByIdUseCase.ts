import { CustomError } from "../../errors/customError";
import { AppointmentRepository } from "../../repositories/appointment.repository";

export class GetAppointmentByIdUseCase {

  public readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  public async execute (id: number) {
    if ( isNaN(id) ) throw CustomError.badRequest("Invalid appointment ID");

    return this.repository.getById(id);
  }
}