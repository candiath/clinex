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
  //todo: decidir si execute necesita alguna data o no
  public async execute () {

    return this.repository.getAll();

  }
}