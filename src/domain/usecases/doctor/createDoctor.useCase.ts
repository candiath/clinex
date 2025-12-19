import { Doctor } from "../../entities/doctor.entity";
import { CustomError } from "../../errors/customError";
import { DoctorDataSchema } from "../../interfaces/dataSchemas.interfaces";
import { DoctorInterface } from "../../interfaces/doctor.interfaces";
import { DoctorRepository } from "../../repositories/doctorRepository";

export class CreateDoctorUseCase {
  constructor(private readonly repository: DoctorRepository) {
    this.repository = repository;
  }

  public async execute(dto: DoctorInterface): Promise<Doctor> {
    const parsedDto = DoctorDataSchema.safeParse(dto);
    if (!parsedDto.success) {
      throw CustomError.badRequest(parsedDto.error.message, {
        location: "CreateDoctorUseCase",
      });
    }
    const doctor = Doctor.create(
      dto.name,
      dto.specialty,
      dto.email,
      dto.phone
    );

    return this.repository.save(doctor);
  }
}
