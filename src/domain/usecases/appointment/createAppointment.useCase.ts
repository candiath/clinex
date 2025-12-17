import { AppointmentDTO } from "../../dtos/appointment/appointment.dto";
import { Appointment } from "../../entities/appointment.entity";
import { CustomError } from "../../errors/customError";
import { AppointmentRepository } from "../../repositories/appointment.repository";

export class CreateAppointmentUseCase {
  public readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  public async execute(data: AppointmentDTO): Promise<Appointment | null> {
    if (!data) throw CustomError.badRequest("No appointment data provided");

    if (!data.patientId) {
      throw CustomError.badRequest("Patient ID is required");
    }
    
    if (!data.doctorId) {
      throw CustomError.badRequest("Doctor ID is required");
    }
    
    if (!data.dateTime) {
      throw CustomError.badRequest("Date and time are required");
    }
    
    if (!data.status) {
      throw CustomError.badRequest("Status is required");
    }

    if (data.dateTime < new Date()) {
      throw CustomError.badRequest("Appointment date cannot be in the past");
    }

    const appointment = Appointment.create(
      data.patientId,
      data.doctorId,
      data.dateTime,
      data.status,
    );

    try {
      return await this.repository.create(appointment);
    } catch (error) {
      throw CustomError.internalServerError("Failed to save appointment", { location: "CreateAppointmentUseCase" });
    }
  }
}
