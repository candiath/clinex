import { Appointment } from "../../entities/appointment.entity";
import { CustomError } from "../../errors/customError";
import { AppointmentInterface } from "../../interfaces/appointment.interfaces";
import { AppointmentDataSchema } from "../../interfaces/dataSchemas.interfaces";
import { AppointmentRepository } from "../../repositories/appointment.repository";

export class CreateAppointmentUseCase {
  public readonly repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  public async execute(data: AppointmentInterface): Promise<Appointment> {
    const parsedData = AppointmentDataSchema.safeParse(data);
    if (!parsedData.success)
      throw CustomError.badRequest(parsedData.error.message, {
        location: "CreateAppointmentUseCase",
      });

    const appointment = Appointment.create(
      data.patientId,
      data.doctorId,
      data.date,
      data.status
    );

    return await this.repository.create(appointment);
    }
  }
