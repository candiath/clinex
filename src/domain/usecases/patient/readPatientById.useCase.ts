import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { CustomError } from "../../errors/customError";
import { Patient } from "../../entities/patient.entity";
import { EntityID } from "../../valueObjects/entityID";

export class ReadPatientByIdUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(id: EntityID): Promise<Patient> {
    let existingPatient;
    try {
      existingPatient = await this.repository.findById(id);
    } catch (error) {
      throw CustomError.internalServerError("Error fetching patient from DB", {
        location: "ReadPatientByIdUseCase",
      });
    }

    if (!existingPatient) throw CustomError.notFound("Patient not found");
    return existingPatient;
  }
}
