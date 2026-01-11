import { AppointmentRepository } from "../../repositories/appointment.repository";
import { EntityID } from "../../valueObjects/entityID";
import { CustomError } from "../../errors/customError";


export class DeleteAppointmentUseCase {

  public readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  public async execute (id: EntityID): Promise<boolean> {
    // Check if appointment exists first
    const appointment = await this.repository.getById(id);
    
    if (!appointment)
      throw CustomError.notFound("Appointment not found", {
        location: "DeleteAppointmentUseCase",
      });
    
    return this.repository.delete(id);
  }
}