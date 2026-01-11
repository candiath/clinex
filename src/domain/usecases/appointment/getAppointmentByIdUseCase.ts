import { AppointmentRepository } from "../../repositories/appointment.repository";
import { EntityID } from "../../valueObjects/entityID";
import { CustomError } from "../../errors/customError";
import { Appointment } from "../../entities/appointment.entity";

export class GetAppointmentByIdUseCase {

  public readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  public async execute (id: EntityID): Promise<Appointment> {
    const appointment = await this.repository.getById(id);
    
    if (!appointment)
      throw CustomError.notFound("Appointment not found", {
        location: "GetAppointmentByIdUseCase",
      });
    
    return appointment;
  }
}