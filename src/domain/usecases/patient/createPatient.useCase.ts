import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { Patient } from "../../entities/patient.entity";
import { CustomError } from "../../errors/customError";
import { PatientDataSchema } from "../../interfaces/dataSchemas.interfaces";

export class CreatePatientUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(dto: Patient): Promise<Patient> {
    const parsedPatient = PatientDataSchema.safeParse(dto);
    if (!parsedPatient.success)
      throw CustomError.badRequest(parsedPatient.error.message);

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
