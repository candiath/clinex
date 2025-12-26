import { PatientRepoImplementation } from "../../../infrastructure/repositories/patientRepositoryImplementation";
import { CustomError } from "../../errors/customError";
import { EntityIDSchema } from "../../interfaces/dataSchemas.interfaces";
import { EntityID } from "../../valueObjects/entityID";

interface DeletePatientInput {
  id: EntityID;
}

export class DeletePatientUseCase {
  constructor(private readonly repository: PatientRepoImplementation) {}

  public async execute(id: any): Promise<boolean> {

    const parsedID = EntityIDSchema.safeParse(id);

    if (!parsedID.success ) throw CustomError.badRequest(parsedID.error.message);

    const existingPatient = await this.repository.findById(id);
    if (!existingPatient) throw CustomError.notFound("Patient does not exist", {location: "DeletePatientUseCase"});

    const deleted = await this.repository.delete(id);

    return deleted;
  }
}
