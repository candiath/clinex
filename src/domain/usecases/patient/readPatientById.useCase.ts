import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { CustomError } from "../../errors/customError";
import { EntityIDHelper } from "../../helpers/entityID.helper";

export class ReadPatientByIdUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(data: any): Promise<any> {
    // Database-agnostic ID validation
    const validationError = EntityIDHelper.isValidEntityID(data?.id);
    if (!data.id || validationError) {
      throw CustomError.badRequest(validationError || "Invalid ID format");
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