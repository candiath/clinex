import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { CustomError } from "../../errors/customError";
import { Patient } from "../../entities/patient.entity";

export class ReadPatientByIdUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(id: number): Promise<Patient> {
    if (!id) throw CustomError.badRequest("Patient ID not provided");
    let existingPatient;
    try {
      existingPatient = await this.repository.findById(id);
    } catch (error) {
      throw CustomError.internalServerError("Error fetching patient from DB");
    }

    if (!existingPatient) throw CustomError.notFound("Patient not found");
    return existingPatient;
  }
}