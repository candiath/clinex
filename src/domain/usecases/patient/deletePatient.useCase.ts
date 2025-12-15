import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { CustomError } from "../../errors/customError";
import { EntityID } from "../../valueObjects/entityID";

interface DeletePatientInput {
  id: EntityID;
}

export class DeletePatientUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(id: any): Promise<boolean> {

    if ( !id || id === null ) throw CustomError.badRequest("Patient ID is required");

    const existingPatient = await this.repository.findById(id);
    if (!existingPatient) throw CustomError.notFound("Patient not found");

    const deleted = await this.repository.delete(id);

    return deleted;
  }
}
