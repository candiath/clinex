import { AppointmentDTO } from "../../dtos/appointment/appointment.dto";
import { CustomError } from "../../errors/customError";
import { AppointmentRepository } from "../../repositories/appointment.repository";


export class UpdateAppointmentUseCase {
  
  public readonly repository: AppointmentRepository;

  constructor (repository: AppointmentRepository) {
    this.repository = repository;
  }


  public async execute (id: number, data: AppointmentDTO) {

    if ( isNaN(id) ) throw CustomError.badRequest("Invalid appointment ID");
    return await this.repository.update(id, data);
  }
}