import { Appointment } from "../../entities/appointment.entity";
import { AppointmentInterface } from "../../interfaces/appointment.interfaces";
import { AppointmentRepository } from "../../repositories/appointment.repository";
import { AppointmentStatus } from "../../valueObjects/appointmentStatus";
import { EntityID } from "../../valueObjects/entityID";
import { CustomError } from "../../errors/customError";


export class UpdateAppointmentUseCase {
  
  public readonly repository: AppointmentRepository;

  constructor (repository: AppointmentRepository) {
    this.repository = repository;
  }


  public async execute (id: EntityID, data: AppointmentInterface): Promise<Appointment> {
    // Check if appointment exists first
    const existingAppointment = await this.repository.getById(id);
    
    if (!existingAppointment)
      throw CustomError.notFound("Appointment not found", {
        location: "UpdateAppointmentUseCase",
      });
    
    // Merge new data with existing data (for partial updates)
    const newAppointment = Appointment.create(
      data.patientId ?? existingAppointment.patientId,
      data.doctorId ?? existingAppointment.doctorId,
      data.dateTime ?? existingAppointment.dateTime,
      data.status ? AppointmentStatus.create(data.status) : existingAppointment.status,
      data.reason ?? existingAppointment.reason,
      data.notes ?? existingAppointment.notes
    );
    return await this.repository.update(id, newAppointment);
  }
}