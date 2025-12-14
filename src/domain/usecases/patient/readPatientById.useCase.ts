import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { CustomError } from "../../errors/customError";
import { Patient } from "../../entities/patient.entity";
import { EntityID } from "../../valueObjects/entityID";

interface ReadPatientByIdInput {
  id?: EntityID;
}

export class ReadPatientByIdUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(data: ReadPatientByIdInput): Promise<Patient> {
    if (!data.id) throw CustomError.badRequest("Patient ID is required");
    let existingPatient;
    try {
      existingPatient = await this.repository.findById(data.id);
    } catch (error) {
      throw CustomError.internalServerError("Error fetching patient from DB");
    }

    if (!existingPatient) throw CustomError.notFound("Patient not found");
    return existingPatient;
  }
}