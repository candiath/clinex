import { Types } from "mongoose";
import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { PatientDTO } from "../../dtos/patient/patient.dto";
import { CustomError } from "../../errors/customError";

interface UpdatePatientInput {
  id?: string; // Can be undefined from Express
  dni?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string | Date;
  email?: string;
  sex?: string;
}

export class UpdatePatientUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(data: UpdatePatientInput): Promise<boolean> {
    // MongoDB-specific validation
    if (!data.id ) {
      throw CustomError.badRequest("Invalid ID format");
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