import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { CustomError } from "../../errors/customError";
import { EntityIDHelper } from "../../helpers/entityID.helper";

export class DeletePatientUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(data: any): Promise<boolean> {
    // Database-agnostic ID validation
    const validationError = EntityIDHelper.isValidEntityID(data?.id);
    if (!data || !data.id || validationError) {
      throw CustomError.badRequest(validationError || "Invalid ID format");
    }

    const existingPatient = await this.repository.findById(data.id);
    if (!existingPatient) throw CustomError.notFound("Patient not found");

    const deleted = await this.repository.delete(data.id);

    return deleted;
  }
}