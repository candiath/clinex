import { AppointmentDTO } from "../../dtos/appointment.dto";
import { Appointment } from "../../entities/appointment.entity";
import { CustomError } from "../../errors/customError";
import { AppointmentRepository } from "../../repositories/appointment.repository";

export class CreateAppointmentUseCase {
  private repository: AppointmentRepository;
  
  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  public async execute (data: any) {
    const [error, dto] = AppointmentDTO.validate(data);
    if (error) throw CustomError.badRequest(error);

    if (dto!.patientId === null || dto!.patientId === undefined) {
      throw CustomError.badRequest('Patient ID is required');
    }
    if (dto!.doctorId === null || dto!.doctorId === undefined) {
      throw CustomError.badRequest('Doctor ID is required');
    }

    if (dto!.dateTime === null || dto!.dateTime === undefined) {
      throw CustomError.badRequest('Date and time are required');
    }

    if (dto!.status === null || dto!.status === undefined) {
      throw CustomError.badRequest('Status is required');
    }


    const appointment = Appointment.create(
      dto!.patientId,
      dto!.doctorId,
      dto!.dateTime,
      dto!.status,
      dto!.reason,
      dto!.notes,
    )

    try {
      
      return this.repository.create(appointment);
    } catch (error) {
      console.log(error);
    }
  }
}