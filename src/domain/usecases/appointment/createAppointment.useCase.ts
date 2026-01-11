import { Appointment } from "../../entities/appointment.entity";
import { CustomError } from "../../errors/customError";
import { createAppointmentInput } from "../../interfaces/appointment.interfaces";
import { AppointmentDataSchema } from "../../interfaces/dataSchemas.interfaces";
import { AppointmentRepository } from "../../repositories/appointment.repository";
import { AppointmentStatus } from "../../valueObjects/appointmentStatus";

export class CreateAppointmentUseCase {
  public readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  public async execute(data: createAppointmentInput): Promise<Appointment> {
    const parsedData = AppointmentDataSchema.safeParse(data);
    if (!parsedData.success)
      throw CustomError.badRequest(parsedData.error.message, {
        location: "CreateAppointmentUseCase",
      });

    const appointment = Appointment.create(
      data.patientId,
      data.doctorId,
      data.dateTime,
      AppointmentStatus.create(data.status)
    );

    return await this.repository.create(appointment);
    }
  }
