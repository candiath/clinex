import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { CustomError } from "../../errors/customError";
import { Patient } from "../../entities/patient.entity";
import { EntityID } from "../../valueObjects/entityID";
import { EntityIDSchema } from "../../interfaces/dataSchemas.interfaces";

export class ReadPatientByIdUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(id: EntityID): Promise<Patient> {
    const parsedID = EntityIDSchema.safeParse(id);
    if (!parsedID.success)
      throw CustomError.badRequest(parsedID.error.message, {
        location: "ReadPatientByIdUseCase",
      });

    const existingPatient = await this.repository.findById(id);

    if (!existingPatient)
      throw CustomError.notFound("Patient not found", {
        location: "ReadPatientByIdUseCase",
      });
    return existingPatient;
  }
}
