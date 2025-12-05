import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { PatientDTO } from "../../dtos/patient/patient.dto";
import { Patient } from "../../entities/patient.entity";
import { CustomError } from "../../errors/customError";

export class CreatePatientUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(data: any) {
    const [error, dto] = PatientDTO.validate(data);
    if (error) throw CustomError.badRequest(error);

    console.log('DTO validated:', dto);
    if (dto!.dni === null || dto!.dni === undefined) throw CustomError.badRequest('Patient DNI is required');
    if (dto!.firstName === null || dto!.firstName === undefined) throw CustomError.badRequest('Patient first name is required');
    if (dto!.lastName === null || dto!.lastName === undefined) throw CustomError.badRequest('Patient last name is required');
    if (dto!.birthDate === null || dto!.birthDate === undefined) throw CustomError.badRequest('Patient birth date is required');
    if (dto!.sex === null || dto!.sex === undefined) throw CustomError.badRequest('Patient sex is required');

    const patient = new Patient(
      dto!.dni,
      dto!.firstName,
      dto!.lastName,
      dto!.birthDate,
      dto!.email ?? "",
      dto!.sex
    );

    return await this.repository.save(patient);
  }
}
