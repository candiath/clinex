import { Types } from "mongoose";
import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { CustomError } from "../../errors/customError";

export class ReadPatientByIdUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(data: any): Promise<any> {
    // MongoDB-specific validation
    if (!data.id || !Types.ObjectId.isValid(data.id)) {
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