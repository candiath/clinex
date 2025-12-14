import { AppointmentDTO } from "../../dtos/appointment.dto";
import { Appointment } from "../../entities/appointment.entity";
import { CustomError } from "../../errors/customError";
import { AppointmentRepository } from "../../repositories/appointment.repository";

export class CreateAppointmentUseCase {
  public readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  public async execute(data: any) {
    const [error, dto] = AppointmentDTO.validate(data);
    if (error) throw CustomError.badRequest(error);
    if (!dto) throw CustomError.internalServerError("DTO validation failed");

    // Validar reglas de negocio: campos obligatorios para crear una cita
    if (!dto.patientId) {
      throw CustomError.badRequest("Patient ID is required");
    }
    
    if (!dto.doctorId) {
      throw CustomError.badRequest("Doctor ID is required");
    }
    
    if (!dto.dateTime) {
      throw CustomError.badRequest("Date and time are required");
    }
    
    if (!dto.status) {
      throw CustomError.badRequest("Status is required");
    }

    // Validar reglas de negocio adicionales
    if (dto.dateTime < new Date()) {
      throw CustomError.badRequest("Appointment date cannot be in the past");
    }

    // Log de propiedades opcionales presentes
    // const hasReason = dto.reason !== undefined && dto.reason !== null;
    // const hasNotes = dto.notes !== undefined && dto.notes !== null;
    // console.log(`Creating appointment - Reason: ${hasReason}, Notes: ${hasNotes}`);

    const appointment = Appointment.create(
      dto.patientId,
      dto.doctorId,
      dto.dateTime,
      dto.status,
      // dto.reason,
      // dto.notes
    );

    try {
      return await this.repository.create(appointment);
    } catch (error) {
      throw CustomError.internalServerError("Failed to create appointment");
    }
  }
}
