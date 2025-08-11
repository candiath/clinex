import { CustomError } from "../../errors/customError";
import { ValidationHelper } from "../../helpers/validation.helper";
import { AppointmentRepository } from "../../repositories/appointment.repository";


export class DeleteAppointmentUseCase {

  public readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  public async execute (id: any) {
    const error = ValidationHelper.validateEntityID(id);
    if (error) throw CustomError.badRequest(error);

    return this.repository.delete(id);
  }
}