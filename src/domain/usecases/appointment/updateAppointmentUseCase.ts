import { Appointment } from "../../entities/appointment.entity";
import { AppointmentInterface } from "../../interfaces/appointment.interfaces";
import { AppointmentRepository } from "../../repositories/appointment.repository";
import { AppointmentStatus } from "../../valueObjects/appointmentStatus";
import { EntityID } from "../../valueObjects/entityID";


export class UpdateAppointmentUseCase {
  
  public readonly repository: AppointmentRepository;

  constructor (repository: AppointmentRepository) {
    this.repository = repository;
  }


  public async execute (id: EntityID, data: AppointmentInterface): Promise<Appointment> {
    const newAppointment = Appointment.create(
      data.patientId,
      data.doctorId,
      data.date,
      AppointmentStatus.create(data.status)
    );
    return await this.repository.update(id, newAppointment);
  }
}