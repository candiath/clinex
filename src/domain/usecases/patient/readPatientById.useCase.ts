import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { CustomError } from "../../errors/customError";
import { Patient } from "../../entities/patient.entity";

interface ReadPatientByIdInput {
  id?: string;
}

export class ReadPatientByIdUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(data: ReadPatientByIdInput): Promise<Patient> {
    // MongoDB-specific validation
    if (!data.id ) {
      throw CustomError.badRequest("Invalid ID format");
    }

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