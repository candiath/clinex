import { Types } from "mongoose";
import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { CustomError } from "../../errors/customError";

export class DeletePatientUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(data: any): Promise<boolean> {
    // MongoDB-specific validation
    if (!data || !data.id ) {
      throw CustomError.badRequest("Invalid ID format");
    }

    const existingPatient = await this.repository.findById(data.id);
    if (!existingPatient) throw CustomError.notFound("Patient not found");

    const deleted = await this.repository.delete(data.id);

    return deleted;
  }
}