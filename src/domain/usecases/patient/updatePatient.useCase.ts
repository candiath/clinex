import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { PatientDTO } from "../../dtos/patient/patient.dto";
import { CustomError } from "../../errors/customError";
import { EntityIDHelper } from "../../helpers/entityID.helper";

export class UpdatePatientUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(data: any): Promise<boolean> {
    // Database-agnostic ID validation
    const validationError = EntityIDHelper.isValidEntityID(data?.id);
    if (!data.id || validationError) {
      throw CustomError.badRequest(validationError || "Invalid ID format");
    }

    const existingPatient = await this.repository.findById(data.id);
    if (!existingPatient) throw CustomError.notFound();

    const [error, dto] = PatientDTO.validate(data);
    if (error) throw CustomError.badRequest(error);

    // Update the patient with the new data
    const updatedPatient = await this.repository.update(existingPatient.id!, dto!);

    return updatedPatient;
  }
}