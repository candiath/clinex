import { AppointmentDTO } from "../../dtos/appointment.dto";
import { CustomError } from "../../errors/customError";
import { AppointmentRepository } from "../../repositories/appointment.repository";


export class UpdateAppointmentUseCase {
  
  public readonly repository: AppointmentRepository;

  constructor (repository: AppointmentRepository) {
    this.repository = repository;
  }


  public async execute (data: any) {

    const [error, dto] = AppointmentDTO.validate(data);
    if (error) throw CustomError.badRequest(error);

    if (!dto!.id) throw CustomError.badRequest('ID not provided');
    return await this.repository.update(dto!);
  }
}