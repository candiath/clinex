import { AppointmentDTO } from "../../dtos/appointment.dto";
import { CustomError } from "../../errors/customError";
import { ValidationHelper } from "../../helpers/validation.helper";
import { AppointmentRepository } from "../../repositories/appointment.repository";
import { EntityID } from "../../types/entityID.type";


export class GetAllAppointmentsUseCase {

  public readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }
/**
 * 
 * @param data valid appointment id
 */
  public async execute (data: any) {

    const error = ValidationHelper.validateEntityID(data);
    if (error) throw CustomError.badRequest(error);

    return this.repository.getAll();

  }
}