import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { PatientDTO } from "../../dtos/patient/patient.dto";
import { Patient } from "../../entities/patient.entity";
import { CustomError } from "../../errors/customError";

export class CreatePatientUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(dto: PatientDTO): Promise<Patient | null> {

    if (dto!.dni == null) throw CustomError.badRequest('Patient DNI is required');
    if (dto!.firstName == null) throw CustomError.badRequest('Patient first name is required');
    if (dto!.lastName == null) throw CustomError.badRequest('Patient last name is required');
    if (dto!.birthDate == null) throw CustomError.badRequest('Patient birth date is required');
    if (dto!.sex == null) throw CustomError.badRequest('Patient sex is required');

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
